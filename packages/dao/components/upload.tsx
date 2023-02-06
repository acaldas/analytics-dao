"use client";
import { Button, Spinner } from "@analytics/ui";
import useAnalytics from "hooks/useAnalytics";
import { useState } from "react";
import { useAccount } from "wagmi";

const Upload: React.FC<{ onUpload: (tokenId: number) => void }> = ({
  onUpload,
}) => {
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

    setTimeout(async () => {
      setLoading(false);
      onUpload((await result.json()).tokenId);
    }, 1000);
  };

  return (
    <Button
      color="light"
      disabled={!analytics?.events.length || !isConnected || loading}
      onClick={uploadAnalytics}
      className="flex items-center"
    >
      <span>Upload {analytics?.events.length ?? 0} events</span>
      {loading && (
        <div className="ml-4">
          <Spinner />
        </div>
      )}
    </Button>
  );
};

export default Upload;
