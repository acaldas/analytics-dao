import { ExtensionEvent, Event, UserFile, ExtensionSettings } from "./types";

export function extensionEventToEvent(event: ExtensionEvent): Event {
  try {
    const url = new URL(event.properties.url);
    return {
      type: event.type,
      properties: {
        ...event.properties,
        host: url.hostname,
      },
      timestamp: event.meta?.ts.toString() ?? (event as any as Event).timestamp,
    };
  } catch (error) {
    console.log("error", error);
    console.error(event.properties);
  }
}

export function getHostEventsCount(events: Event[]) {
  return events.reduce((acc, curr) => {
    const count = acc[curr.properties.host] || 0;
    acc[curr.properties.host] = count + 1;
    return acc;
  }, {} as Record<string, number>);
}

export const defaultExtensionSettings: ExtensionSettings = {
  location: {
    enabled: false,
  },
  gender: {
    enabled: false,
  },
  age: {
    enabled: false,
  },
  locale: {
    enabled: false,
  },
  OS: {
    enabled: false,
  },
  timezone: {
    enabled: false,
  },
  browser: {
    enabled: false,
  },
};
