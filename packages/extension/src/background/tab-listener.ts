try {
  chrome.webNavigation.onHistoryStateUpdated.addListener((event) => {
    chrome.tabs.sendMessage(event.tabId, {
      message: "history-update",
      url: event.url,
    });
  });
  console.log("LISTENING");
  chrome.runtime.onMessageExternal.addListener(async function (
    request,
    sender,
    sendResponse
  ) {
    console.log(sender, request);
    const storage = await chrome.storage.local.get();
    sendResponse({ storage });
    return true;
  });
} catch (error) {
  console.log("Background error:", error);
}
export {};
