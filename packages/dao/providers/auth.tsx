import React, { createContext, useEffect, useMemo, useState } from "react";
import { SiweMessage } from "siwe";
import { useAccount, useDisconnect, useNetwork, useSignMessage } from "wagmi";

interface IAuthContext {
  address?: string;
  error?: Error;
  loggedIn: boolean;
  walletConnected: boolean;
  setAddress: (address: string) => void;
  logout: () => void;
}

const AuthContext = createContext<IAuthContext | undefined>(undefined);

function AuthProvider({ children }: { children: React.ReactNode }) {
  const { isConnected } = useAccount();
  const { disconnectAsync } = useDisconnect();
  const [address, setAddress] = useState<string>();

  useEffect(() => {
    const handler = async () => {
      try {
        const res = await fetch("/api/auth/account");
        const json = await res.json();
        setAddress(json.address);
      } catch (_error) {}
    };

    handler();

    window.addEventListener("focus", handler);
    return () => window.removeEventListener("focus", handler);
  }, []);

  async function logout() {
    await fetch("/api/auth/logout");
    const test = await disconnectAsync();
    console.log(test);
    setAddress(undefined);
  }

  const authValue: IAuthContext = useMemo(
    () => ({
      walletConnected: isConnected,
      address,
      setAddress,
      loggedIn: !!address,
      logout,
    }),
    [isConnected, address]
  );

  return (
    <AuthContext.Provider value={authValue}>{children}</AuthContext.Provider>
  );
}

function useAuth() {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within a AuthProvider");
  }
  return context;
}

function useLogin() {
  const [state, setState] = useState<{
    loading?: boolean;
    nonce?: string;
    error?: Error;
  }>({});
  const { setAddress } = useAuth();
  const { signMessageAsync } = useSignMessage();

  const fetchNonce = async () => {
    try {
      const nonceRes = await fetch("/api/auth/nonce");
      const nonce = await nonceRes.text();
      setState((x) => ({ ...x, nonce }));
    } catch (error) {
      setState((x) => ({ ...x, error: error as Error }));
    }
  };

  useEffect(() => {
    fetchNonce();
  }, []);

  const login = async (address?: string, chainId?: number) => {
    try {
      if (!address || !chainId) {
        throw new Error("Wallet not connected!");
      }

      setState((x) => ({ ...x, loading: true }));
      const message = new SiweMessage({
        domain: window.location.host,
        address,
        statement: "Sign in with Wallet.",
        uri: window.location.origin,
        version: "1",
        chainId,
        nonce: state.nonce,
      });
      const signature = await signMessageAsync({
        message: message.prepareMessage(),
      });

      const verifyRes = await fetch("/api/auth/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message, signature }),
      });
      if (!verifyRes.ok) throw new Error("Error verifying message");

      setState((x) => ({ ...x, loading: false }));
      setAddress(address);
    } catch (error) {
      setState((x) => ({ ...x, loading: false, nonce: undefined }));
      setState((x) => ({ ...x, error: error as Error }));
      fetchNonce();
    }
  };

  return { login, ...state };
}

export { AuthProvider, useAuth, useLogin };
