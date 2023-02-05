import { flattenDiagnosticMessageText } from "typescript";

try {
  chrome.webNavigation.onHistoryStateUpdated.addListener((event) => {
    chrome.tabs.sendMessage(event.tabId, {
      message: "history-update",
      url: event.url,
    });
  });

  chrome.runtime.onMessageExternal.addListener(async function (
    message,
    sender,
    sendResponse
  ) {
    if (sender.origin !== "http://localhost:3000") {
      return false;
    }

    switch (message.request) {
      case "get-analytics":
        const storage = await chrome.storage.local.get();
        sendResponse({ storage });
        break;
    }
    return true;
  });
} catch (error) {
  console.log("Background error:", error);
}
export {};
