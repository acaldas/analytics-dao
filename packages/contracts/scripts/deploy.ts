// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
import hre, { ethers } from "hardhat";
import { ERC721UserFile__factory } from "../types";

const util = require("util");
const request = util.promisify(require("request"));

async function callRpc(method: any) {
  var options = {
    method: "POST",
    url: "https://api.hyperspace.node.glif.io/rpc/v1",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      jsonrpc: "2.0",
      method: method,
      id: 1,
    }),
  };
  const res = await request(options);
  return JSON.parse(res.body).result;
}

async function main() {
  const [signer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with the account:", signer.address);

  const priorityFee = await callRpc("eth_maxPriorityFeePerGas");

  const ERC721UserFileFactory: ERC721UserFile__factory =
    await hre.ethers.getContractFactory("ERC721UserFile");
  const ERC721UserFile = await ERC721UserFileFactory.deploy({
    maxPriorityFeePerGas: ethers.BigNumber.from(priorityFee),
  });
  await ERC721UserFile.deployed();
  console.log(
    `ERC721UserFile deployed to ${ERC721UserFile.address} by ${signer.address}`
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
