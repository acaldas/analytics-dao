import { ethers } from "ethers";
import { ERC721UserFile } from "../types";
import ERC721UserFileABI from "../artifacts/contracts/ERC721UserFile.sol/ERC721UserFile.json";
import { TransferEvent } from "../types/contracts/ERC721UserFile";

const ERC721_ADDRESS =
  process.env.ERC721_ADDRESS || process.env.NEXT_PUBLIC_ERC721_ADDRESS;

const RPC_PROVIDER =
  process.env.RPC_PROVIDER ||
  process.env.NEXT_PUBLIC_RPC_PROVIDER ||
  "http://127.0.0.1:8545/";

if (!ERC721_ADDRESS) {
  throw new Error("ERC721_ADDRESS not defined");
}

const provider = new ethers.providers.JsonRpcProvider(RPC_PROVIDER);

const OWNER_PRIVATE_KEY = process.env.OWNER_PRIVATE_KEY;

const contract = new ethers.Contract(
  ERC721_ADDRESS!,
  ERC721UserFileABI.abi,
  provider
) as ERC721UserFile;

export async function mintUserFile(to: string, metadataCId: string) {
  if (!OWNER_PRIVATE_KEY) {
    throw new Error("OWNER_PRIVATE_KEY not defined");
  }
  const wallet = new ethers.Wallet(OWNER_PRIVATE_KEY!);
  const signer = wallet.connect(provider);
  const ownerContract = contract.connect(signer);
  const transaction = await ownerContract.mint(to, metadataCId);
  const receipt = await transaction.wait();
  const transferEvent = receipt.events?.find(
    (e) => e.event === "Transfer"
  ) as TransferEvent;
  const tokenId = transferEvent
    ? ethers.BigNumber.from(transferEvent.args[2])
    : undefined;

  return tokenId?.toNumber();
}

export async function getUserTokenIds(user: string) {
  const balance = await contract.balanceOf(user);
  if (balance.isZero()) {
    return [];
  }
  const tokenIds = [];
  const count = balance.toNumber();
  for (let i = 0; i < count; i++) {
    const tokenId = await contract.tokenOfOwnerByIndex(user, i);
    tokenIds.push(tokenId.toNumber());
  }

  return tokenIds;
}

export async function getUserFilePrice(tokenId: number) {
  return contract.getUserFilePrice(tokenId);
}

export async function setUserFileEventCount(
  tokenId: number,
  eventCount: Record<string, number>
) {
  if (!OWNER_PRIVATE_KEY) {
    throw new Error("OWNER_PRIVATE_KEY not defined");
  }
  const wallet = new ethers.Wallet(OWNER_PRIVATE_KEY!);
  const signer = wallet.connect(provider);
  const ownerContract = contract.connect(signer);
  const hosts = Object.keys(eventCount);
  const count = hosts.map((host) => eventCount[host]);
  await ownerContract.setUserFileEventCount(tokenId, hosts, count);
}
