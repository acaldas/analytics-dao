import {
  useAccount,
  useConnect,
  useDisconnect,
  useNetwork,
  useSwitchNetwork,
} from "wagmi";
import { InjectedConnector } from "wagmi/connectors/injected";
import { wagmiChains } from "../providers";

const Profile: React.FC = () => {
  const { address, isConnected } = useAccount();
  const { connect } = useConnect({
    connector: new InjectedConnector(),
  });
  const { disconnect } = useDisconnect();

  const { chain } = useNetwork();
  const { error, isLoading, pendingChainId, switchNetwork } =
    useSwitchNetwork();
  return (
    <div>
      {" "}
      <div>
        {" "}
        {isConnected ? (
          <div>
            Connected to {address}
            <button onClick={() => disconnect()}>Disconnect</button>
          </div>
        ) : (
          <button onClick={() => connect()}>Connect Wallet</button>
        )}
      </div>
      <div>
        {chain && <div>Connected to {chain.name}</div>}

        {wagmiChains.map((x) => (
          <button
            disabled={!switchNetwork || x.id === chain?.id}
            key={x.id}
            onClick={() => switchNetwork?.(x.id)}
          >
            {x.name}
            {isLoading && pendingChainId === x.id && " (switching)"}
          </button>
        ))}

        <div>{error && error.message}</div>
      </div>
    </div>
  );
};

export default Profile;
