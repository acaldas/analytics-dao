import React from "react";
import ReactDOM from "react-dom/client";
import { WagmiProvider } from "@analytics/ui";
import App from "./App";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <WagmiProvider>
      <App />
    </WagmiProvider>
  </React.StrictMode>
);
