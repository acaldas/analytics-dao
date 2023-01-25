import Analytics from "analytics";

const analytics = Analytics({
  app: "Lyt",
  version: "0.0.1",
  plugins: [
    {
      name: "lyt-plugin",
      page: async (event: { payload: Record<string, unknown> }) => {
        const { events } = await chrome.storage.local.get("events");
        events.push(event.payload);
        chrome.storage.local.set({ events });
      },
    },
  ],
});

const reset = () => {
  analytics.reset();
  chrome.storage.local.clear();
};

const init = async () => {
  // initialize user id
  const storageUserId = (await chrome.storage.local.get("userId")).userId;
  const currentUserId: string = analytics.user("userId");
  const userId = storageUserId || currentUserId || crypto.randomUUID();
  if (storageUserId !== userId) {
    await chrome.storage.local.set({ userId });
  }
  if (currentUserId !== userId) {
    await analytics.identify(userId);
  }

  // initialize events array
  const data = await chrome.storage.local.get("events");
  if (!Array.isArray(data.events)) {
    await chrome.storage.local.set({ events: [] });
  }

  // track initial page
  analytics.page({ url: location.href });

  // listen to history updates
  chrome.runtime.onMessage.addListener(function (
    request,
    sender,
    sendResponse
  ) {
    if (request.message === "history-update") {
      // check if updated page is new
      const currentUrl = analytics.getState("page").last?.properties?.url;
      if (request.url !== currentUrl) {
        analytics.page({ url: request.url });
      }
    } else {
      console.log(request);
      sendResponse({ message: "ola" });
    }
  });
};

init();
// reset();
