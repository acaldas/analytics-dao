import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import "./App.css";
import { Profile } from "@analytics/ui";

function App() {
  const [count, setCount] = useState(0);
  const [data, setData] = useState({});

  useEffect(() => {
    chrome.storage?.local.get().then((data) => setData(data));
  }, []);

  const uploadEvents = () => {
    fetch("http://localhost:3000/api/upload", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }).then((response) => response.json().then(console.log));
  };
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
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => uploadEvents()}>count is {count}</button>
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
      <Profile />
    </div>
  );
}

export default App;
