import React from "react";
import { WagmiConfig, configureChains, createClient } from "wagmi";
import { jsonRpcProvider } from "wagmi/providers/jsonRpc";

const { provider } = configureChains(
  [
    {
      id: 3141,
      name: "Filecoin Hyperspace Testnet",
      network: "hyperspace testnet",
      nativeCurrency: {
        decimals: 18,
        name: "Filecoin",
        symbol: "tFil",
      },
      rpcUrls: {
        default: { http: ["https://api.hyperspace.node.glif.io/rpc/v0"] },
        public: { http: ["https://api.hyperspace.node.glif.io/rpc/v0"] },
      },
      blockExplorers: {
        default: { name: "Filfox", url: "https://hyperspace.filfox.info/en" },
      },
    },
  ],
  [
    jsonRpcProvider({
      rpc: () => ({
        http: "https://api.hyperspace.node.glif.io/rpc/v0",
      }),
    }),
  ]
);

type Props = {
  children: React.ReactNode;
};

const App: React.FC<Props> = ({ children }) => {
  return <WagmiConfig client={client}>{children}</WagmiConfig>;
};

export default App;
