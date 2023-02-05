"use client";

import React from "react";
import { useAccount, useConnect, useNetwork, useSwitchNetwork } from "wagmi";
import { InjectedConnector } from "wagmi/connectors/injected";
import { useAuth, useLogin } from "providers/auth";
import { Button } from "@analytics/ui";

const CHAIN_ID = Number.parseInt(process.env.NEXT_PUBLIC_CHAIN_ID || "31337");

const Login: React.FC<{ text?: string }> = ({
  text = "Sign-In with Wallet",
}) => {
  const { loggedIn } = useAuth();
  const { login, nonce, loading: isLoadingLogin } = useLogin();
  const { isConnected } = useAccount();
  const { connectAsync, isLoading: isLoadingConnect } = useConnect({
    connector: new InjectedConnector(),
  });
  const { address } = useAccount();
  const { chain } = useNetwork();
  const { isLoading: isLoadingSwitch, switchNetworkAsync } = useSwitchNetwork();

  async function signin() {
    try {
      let newAddress, newChainId;
      if (!isConnected) {
        const result = await connectAsync();
        newAddress = result.account;
        newChainId = result.chain.id;
      }

      if (switchNetworkAsync && chain?.id !== CHAIN_ID) {
        await switchNetworkAsync(CHAIN_ID);
      }

      if (!loggedIn) {
        await login(newAddress ?? address, newChainId ?? chain?.id);
      }
    } catch (error) {
      console.log(error);
    }
  }

  const loading = isLoadingConnect && isLoadingSwitch && isLoadingLogin;
  return (
    <Button
      disabled={loggedIn || !nonce || loading}
      onClick={signin}
      color="dark"
    >
      {text}
    </Button>
  );
};

export default Login;
