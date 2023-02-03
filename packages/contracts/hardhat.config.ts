import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@typechain/hardhat";
import "@nomiclabs/hardhat-ethers";
import "hardhat-gas-reporter";

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
  },
  gasReporter: {
    enabled: false,
  },
};

export default config;
