"use client";
import { Button, Spinner } from "@analytics/ui";
import useAnalytics from "hooks/useAnalytics";
import { useState } from "react";
import { useAccount } from "wagmi";

const Upload: React.FC = () => {
  const { isConnected } = useAccount();
  const analytics = useAnalytics();
  const [loading, setLoading] = useState(false);

  const uploadAnalytics = async () => {
    setLoading(true);
    const result = await fetch("api/upload", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...analytics }),
    });
    console.log(await result.json());
    setLoading(false);
  };

  return (
    <Button
      color="light"
      disabled={!analytics?.events.length || !isConnected || loading}
      onClick={uploadAnalytics}
      className="flex items-center"
    >
      <span>Upload</span>
      {loading && (
        <div className="ml-4">
          <Spinner />
        </div>
      )}
    </Button>
  );
};

export default Upload;
