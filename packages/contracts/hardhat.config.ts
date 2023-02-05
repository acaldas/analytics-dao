import { config as envConfig } from "dotenv";
import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@typechain/hardhat";
import "@nomiclabs/hardhat-ethers";
import "hardhat-gas-reporter";

envConfig();

const PRIVATE_KEY = process.env.PRIVATE_KEY || "";

const config: HardhatUserConfig = {
  solidity: "0.8.17",
  typechain: {
    outDir: "types",
  },
  networks: {
    hardhat: {
      chainId: 31337,
      mining: {
        auto: true,
        interval: 5000,
      },
    },
    hyperspace: {
      chainId: 3141,
      url: "https://filecoin-hyperspace.chainstacklabs.com/rpc/v1",
      accounts: [PRIVATE_KEY],
    },
  },
  gasReporter: {
    enabled: false,
  },
};

export default config;
