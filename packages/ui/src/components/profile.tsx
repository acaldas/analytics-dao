import {
  useAccount,
  useConnect,
  useDisconnect,
  useNetwork,
  useSwitchNetwork,
} from "wagmi";
import { InjectedConnector } from "wagmi/connectors/injected";
import { wagmiChains } from "../providers";
import { Button } from "flowbite-react";
import { useEffect } from "react";

const Profile: React.FC = () => {
  const { address, isConnected } = useAccount();
  const { connect } = useConnect({
    connector: new InjectedConnector(),
  });
  const { disconnect } = useDisconnect();

  const { chain } = useNetwork();
  const { error, isLoading, pendingChainId, switchNetwork } =
    useSwitchNetwork();

  useEffect(() => {});
  return (
    <div className="flex">
      <div>
        {isConnected ? (
          <div className="flex">
            Connected to {address?.slice(0, 5)}...{address?.slice(-4)}
            <Button onClick={() => disconnect()}>Disconnect</Button>
          </div>
        ) : (
          <Button onClick={() => connect()}>Connect Wallet</Button>
        )}
      </div>
      <div>
        {chain && <div>Connected to {chain.name}</div>}

        {wagmiChains.map((x) => (
          <Button
            disabled={!switchNetwork || x.id === chain?.id}
            key={x.id}
            onClick={() => switchNetwork?.(x.id)}
          >
            {x.name}
            {isLoading && pendingChainId === x.id && " (switching)"}
          </Button>
        ))}

        <div>{error && error.message}</div>
      </div>
    </div>
  );
};

export default Profile;
