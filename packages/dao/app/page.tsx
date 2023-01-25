import React from "react";
import styles from "./page.module.css";
import dynamic from "next/dynamic";

const Profile = dynamic(() => import("../components/profile"), { ssr: false });

export default function Home() {
  // useEffect(() => {
  //   var editorExtensionId = "fmjklonmmdmgkabonaaiekcpjjogoddn";

  //   // Make a simple request:
  //   setTimeout(() => {
  //     chrome.runtime.sendMessage(
  //       "fmjklonmmdmgkabonaaiekcpjjogoddn",
  //       { request: "get-analytics" },
  //       function (response) {
  //         if (!window.chrome.runtime.lastError) {
  //           console.log("response");
  //           console.log(response);
  //         } else {
  //           console.log("Error", window.chrome.runtime.lastError);
  //         }
  //       }
  //     );
  //   }, 2000);
  // }, []);
  return (
    <main className={styles.main}>
      <div className={styles.grid}>
        <Profile />
      </div>
    </main>
  );
}
