import { NextApiRequest, NextApiResponse } from "next";
import { ethers } from "ethers";
import lighthouse from "@lighthouse-web3/sdk";
import {
  fetchUserUploads,
  indexUserEvents,
  validateUserEvents,
} from "@analytics/db";
import { extensionEventToEvent, getHostEventsCount } from "@analytics/shared";
import {
  getUserTokenIds,
  mintUserFile,
  setUserFileEventCount,
} from "@analytics/contracts";
import { ApiError } from "next/dist/server/api-utils";
import withIronSessionApiRoute from "hooks/withIronSessionApiRoute";
import { ExtensionEvent } from "@analytics/shared/types";

const sign_auth_message = async (publicKey: string, privateKey: string) => {
  const provider = new ethers.providers.JsonRpcProvider();
  const signer = new ethers.Wallet(privateKey, provider);
  const messageRequested = (await lighthouse.getAuthMessage(publicKey)).data
    .message;
  const signedMessage = await signer.signMessage(messageRequested);
  return signedMessage;
};

const uploadEncrypted = async (payload: string) => {
  const apiKey = process.env.LIGHTHOUSE_API_KEY;
  const publicKey = process.env.LIGHTHOUSE_PUBLIC_KEY || "";
  const privateKey = process.env.LIGHTHOUSE_PRIVATE_KEY || "";
  if (!apiKey || !publicKey || !privateKey) {
    throw new Error("Lighthouse keys not found!");
  }
  const signed_message = await sign_auth_message(publicKey, privateKey);
  const response = await lighthouse.textUploadEncrypted(
    payload,
    apiKey,
    publicKey,
    signed_message
  );
  return response;
};

async function getUserUploads(
  request: NextApiRequest,
  response: NextApiResponse
) {
  try {
    const userAddress = request.session.siwe!.address;
    const tokenIds = await getUserTokenIds(userAddress);
    const uploads = await fetchUserUploads(tokenIds);
    response.status(200).json(uploads);
  } catch (error) {
    console.error(error);
    response.status(500).json({ error: "Internal Server Error" });
  }
}

export default withIronSessionApiRoute(async function (
  request: NextApiRequest,
  response: NextApiResponse
) {
  const userAddress = request.session.siwe?.address;
  if (!userAddress) {
    throw new ApiError(403, "Forbidden");
  }

  if (request.method === "GET") {
    return getUserUploads(request, response);
  }

  const body = request.body;
  const userId: string = body.userId;
  const extensionEvents: ExtensionEvent[] = body.events;

  try {
    if (
      !userAddress ||
      !userId ||
      !extensionEvents ||
      !extensionEvents.length
    ) {
      throw new ApiError(400, "Invalid request");
    }
    const events = extensionEvents.map(extensionEventToEvent);
    if (!validateUserEvents(userId, events)) {
      throw new ApiError(400, "Invalid request");
    }

    const file = await uploadEncrypted(JSON.stringify(events));
    if (file.error) {
      console.error(file.error);
      throw new ApiError(500, "File upload failed");
    }

    const eventCount = getHostEventsCount(events);
    const metadata = {
      description: "LytDao user file",
      userId,
      cId: file.data.Name,
      hosts: eventCount,
    };

    const metadataFile = await uploadEncrypted(JSON.stringify(metadata));

    const tokenId = await mintUserFile(userAddress, metadataFile.data.Name);
    if (tokenId === undefined) {
      throw new ApiError(500, "File mint failed");
    }

    const result = await indexUserEvents(
      userId,
      tokenId,
      events,
      {
        name: file.data.Name,
        hash: file.data.Hash,
        size: file.data.Size,
      },
      metadataFile.data.Name
    );

    setUserFileEventCount(tokenId, eventCount);

    response.status(200).json({ status: "success", result });
  } catch (error) {
    if (error instanceof ApiError) {
      response.status(error.statusCode).json({ error: error.message });
    } else {
      console.error(error);
      response.status(500).json({ error: "Internal Server Error" });
    }
  }
});

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "4mb",
    },
  },
};
