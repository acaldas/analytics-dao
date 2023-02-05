import { defaultExtensionSettings } from "@analytics/shared";
import { ExtensionSettings } from "@analytics/shared/types";
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
  // initialize tracking
  let recording = await chrome.storage.local
    .get("recording")
    .then((value) => value.recording || false);

  // set context
  const context = analytics.getState("context");
  chrome.storage.local.set({ context });

  chrome.storage.local.onChanged.addListener((changes) => {
    if (changes.recording) {
      recording = changes.recording.newValue;
    }
  });

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

  // initialize settings
  let settings: ExtensionSettings = (await chrome.storage.local.get("settings"))
    .settings;
  settings = settings
    ? { ...defaultExtensionSettings, ...settings }
    : defaultExtensionSettings;

  settings.OS.value = context.os.name;
  settings.browser.value = context.userAgent;
  settings.locale.value = context.locale;
  settings.timezone.value = context.timezone;

  await chrome.storage.local.set({
    settings,
  });

  // track initial page
  recording && analytics.page({ url: location.href });

  // listen to history updates
  chrome.runtime.onMessage.addListener(function (
    request,
    sender,
    sendResponse
  ) {
    switch (request.message) {
      case "history-update":
        // check if updated page is new
        const currentUrl = analytics.getState("page").last?.properties?.url;
        if (request.url !== currentUrl && recording) {
          analytics.page({ url: request.url });
        }
        break;
      default:
        sendResponse({ message: "ack" });
    }
    return true;
  });
};

init();
// reset();
