import { NextApiRequest, NextApiResponse } from "next";
import lighthouse from "@lighthouse-web3/sdk";
import { ethers } from "ethers";
import withIronSessionApiRoute from "hooks/withIronSessionApiRoute";

const sign_auth_message = async (publicKey: string, privateKey: string) => {
  const provider = new ethers.providers.JsonRpcProvider();
  const signer = new ethers.Wallet(privateKey, provider);
  const messageRequested = (await lighthouse.getAuthMessage(publicKey)).data
    .message;
  const signedMessage = await signer.signMessage(messageRequested);
  return signedMessage;
};

/* Decrypt file */
const decrypt = async (cId: string) => {
  const apiKey = process.env.LIGHTHOUSE_API_KEY;
  const publicKey = process.env.LIGHTHOUSE_PUBLIC_KEY || "";
  const privateKey = process.env.LIGHTHOUSE_PRIVATE_KEY || "";
  if (!apiKey || !publicKey || !privateKey) {
    throw new Error("Lighthouse keys not found!");
  }

  const signedMessage = await sign_auth_message(publicKey, privateKey);
  const keyObject = await lighthouse.fetchEncryptionKey(
    cId,
    publicKey,
    signedMessage
  );

  const decrypted = await lighthouse.decryptFile(cId, keyObject.data.key);
  return decrypted;
};

export default withIronSessionApiRoute(async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  const userAddress = request.session.siwe?.address;
  if (!userAddress) {
    return response.status(403).json({ error: "Forbidden" });
  }

  const cId = request.query.cid as string;
  const file = await decrypt(cId);
  const content = new TextDecoder().decode(file);
  response.status(200).json(JSON.parse(content));
});
