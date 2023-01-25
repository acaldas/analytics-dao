"use client";

import React from "react";
import { WagmiProvider } from "@analytics/ui";

const Provider = ({ children }: { children: React.ReactNode }) => {
  return <WagmiProvider>{children}</WagmiProvider>;
};

export default Provider;
