import { ExtensionStorage } from "@analytics/shared/types";
import { useEffect, useState } from "react";

const EXTENSION_ID = process.env.NEXT_PUBLIC_EXTENSION_ID;

export default function useAnalytics() {
  const [analytics, setAnalytics] = useState<ExtensionStorage | undefined>();
  const getAnalytics = async function () {
    chrome.runtime.sendMessage(
      EXTENSION_ID,
      {
        request: "get-analytics",
      },
      (response) => {
        if (!window.chrome.runtime.lastError) {
          setAnalytics(response?.storage);
        } else {
          console.log("Error", window.chrome.runtime.lastError);
        }
      }
    );
  };

  useEffect(() => {
    getAnalytics();
  }, []);

  return analytics;
}
