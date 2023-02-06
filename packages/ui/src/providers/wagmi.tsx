import { WagmiConfig, configureChains, createClient } from "wagmi";
import { filecoinHyperspace, hardhat } from "@wagmi/core/chains";
import { publicProvider } from "wagmi/providers/public";

const { provider, chains } = configureChains(
  [filecoinHyperspace, hardhat],
  [publicProvider()]
);

const client = createClient({
  autoConnect: true,
  provider,
});

const Provider = ({ children }: { children: React.ReactNode }) => {
  return <WagmiConfig client={client}>{children}</WagmiConfig>;
};

export { chains };
export default Provider;
