"use client";

import React from "react";
import { WagmiProvider } from "@analytics/ui";
import { AuthProvider } from "providers/auth";

const Provider = ({ children }: { children: React.ReactNode }) => {
  return (
    <WagmiProvider>
      <AuthProvider>{children}</AuthProvider>
    </WagmiProvider>
  );
};

export default Provider;
