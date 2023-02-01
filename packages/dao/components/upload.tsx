"use client";
import { Button } from "@analytics/ui";
import useAnalytics from "hooks/useAnalytics";
import { useAccount } from "wagmi";

const Upload: React.FC = () => {
  const { isConnected } = useAccount();
  const analytics = useAnalytics();
  const uploadAnalytics = async () => {
    const result = await fetch("api/upload", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...analytics }),
    });
    console.log(await result.json());
  };

  return (
    <Button
      color="light"
      disabled={!analytics?.events.length || !isConnected}
      onClick={uploadAnalytics}
    >
      Upload
    </Button>
  );
};

export default Upload;
