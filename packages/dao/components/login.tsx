"use client";

import React from "react";
import { useAuth, useLogin } from "providers/auth";
import { Button } from "@analytics/ui";

const Login: React.FC<{ text?: string }> = ({
  text = "Sign-In with Wallet",
}) => {
  const { walletConnected } = useAuth();
  const { login, nonce, loading } = useLogin();

  return (
    <Button disabled={!walletConnected || !nonce || loading} onClick={login}>
      {text}
    </Button>
  );
};

export default Login;
