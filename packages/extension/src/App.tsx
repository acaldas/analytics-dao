import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import "./App.css";
import { Profile } from "@analytics/ui";
import { ExtensionStorage } from "@analytics/shared/types";

function App() {
  const [recording, setRecording] = useState<boolean | undefined>();
  const [data, setData] = useState<ExtensionStorage>();

  useEffect(() => {
    chrome.storage?.local.get().then((data) => setData(data));
  }, []);

  useEffect(() => {
    if (recording !== undefined) {
      chrome.runtime.sendMessage({
        message: "update-tracking",
        tracking: recording,
      });
    }
  }, [recording]);

  return (
    <div className="App">
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src="/vite.svg" className="logo" alt="Vite logo" />
        </a>
        <a href="https://reactjs.org" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>
        <button
          onClick={() => {
            setRecording((recording) => !recording);
          }}
        >
          {recording ? "Rec" : "Paused"}
        </button>
      </h1>
      <div className="card">
        <button>count is {recording}</button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
      <a href="http://localhost:3000/" target="_blank">
        Upload
      </a>
    </div>
  );
}

export default App;
