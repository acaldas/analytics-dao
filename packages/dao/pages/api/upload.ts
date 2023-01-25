import { NextApiRequest, NextApiResponse } from "next";
import { ethers } from "ethers";
import lighthouse from "@lighthouse-web3/sdk";
import { indexUserEvents, upsertUser, validateUserEvents } from "@analytics/db";
import { ExtensionEvent, extensionEventToEvent } from "@analytics/shared";
import { ApiError } from "next/dist/server/api-utils";

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

// const event = {
//   anonymousId: "e680d336-a4b8-4037-8376-ee1966dae70b",
//   meta: {
//     hasCallback: true,
//     rid: "98b0b8d5-3ce1-413f-a52f-956e05300916",
//     ts: 1673736279435,
//   },
//   options: {},
//   properties: {
//     hash: "",
//     height: 1001,
//     path: "/",
//     search: "",
//     title: "Create Next App",
//     url: "http://localhost:3000/",
//     width: 1920,
//   },
//   type: "page",
//   userId: "d079444f-63d1-479d-bae8-0b3000070fa0",
// };

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  const userId: string = request.body.userId;
  const extensionEvents: ExtensionEvent[] = request.body.events;

  try {
    if (!userId || !extensionEvents || !extensionEvents.length) {
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

    const result = await indexUserEvents(userId, events, {
      name: file.data.Name,
      hash: file.data.Hash,
      size: file.data.Size,
    });

    console.log(result);
    response.status(200).json({ status: "success", result });
  } catch (error) {
    if (error instanceof ApiError) {
      response.status(error.statusCode).json({ error: error.message });
    } else {
      console.error(error);
      response.status(500).json({ error: "Internal Server Error" });
    }
  }
}
