// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
import hre from "hardhat";
import { ERC721UserFile__factory } from "../types";

export async function deployContracts() {
  const ERC721UserFileFactory: ERC721UserFile__factory =
    await hre.ethers.getContractFactory("ERC721UserFile");

  const ERC721UserFile = ERC721UserFileFactory.deploy();
  (await ERC721UserFile).deployed();
  return ERC721UserFile;
}

async function main() {
  const [signer] = await hre.ethers.getSigners();
  const ERC721UserFile = await deployContracts();
  console.log(
    `ERC721UserFile deployed to ${ERC721UserFile.address} by ${signer.address}`
  );

  const userAddress = "0x5fbdb2315678afecb367f032d93f642f64180aa3";
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
