"use client";

import React, { useEffect } from "react";
import styles from "./page.module.css";
import { Profile } from "@analytics/ui";

export default function Home() {
  useEffect(() => {
    var editorExtensionId = "fmjklonmmdmgkabonaaiekcpjjogoddn";

    // Make a simple request:
    setTimeout(() => {
      chrome.runtime.sendMessage(
        "fmjklonmmdmgkabonaaiekcpjjogoddn",
        { request: "get-analytics" },
        function (response) {
          if (!window.chrome.runtime.lastError) {
            console.log("response");
            console.log(response);
          } else {
            console.log("Error", window.chrome.runtime.lastError);
          }
        }
      );
    }, 2000);
  }, []);
  return (
    <main className={styles.main}>
      <div className={styles.grid}>
        <Profile />
      </div>
    </main>
  );
}
