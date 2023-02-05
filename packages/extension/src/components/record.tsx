import { useEffect, useState } from "react";
import { PlayCircleIcon, StopCircleIcon } from "@heroicons/react/24/outline";

export default function Record() {
  const [recording, setRecording] = useState<boolean | undefined>();

  useEffect(() => {
    chrome.storage.local.get("recording").then((value) => {
      setRecording(value.recording || false);
    });
  }, []);
  useEffect(() => {
    if (recording !== undefined) {
      chrome.storage.local.set({ recording });
    }
  }, [recording]);

  return (
    <button
      className="flex flex-col items-center"
      onClick={() => {
        setRecording((recording) => !recording);
      }}
    >
      {recording ? (
        <>
          <p className="text-lg">
            Status: <b className="text-green-600">Recording</b>
          </p>
          <StopCircleIcon
            width={80}
            height={80}
            className="stroke-red-600 font-bold drop-shadow-lg fill-white hover:fill-lighter transition-colors"
          />
        </>
      ) : (
        <>
          <p className="text-lg">
            Status: <b className="text-red-600 font-bold">Paused</b>
          </p>
          <PlayCircleIcon
            width={80}
            height={80}
            className="stroke-green-600 drop-shadow-lg fill-white hover:fill-lighter transition-colors"
          />
        </>
      )}
    </button>
  );
}
