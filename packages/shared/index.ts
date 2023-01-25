import type { Event, ExtensionEvent } from "./types";

export function extensionEventToEvent(event: ExtensionEvent): Event {
  try {
    const url = new URL(event.properties.url);
    return {
      type: event.type,
      properties: {
        ...event.properties,
        host: url.hostname,
      },
      timestamp: event.meta.ts.toString(),
    };
  } catch {
    console.error(event.properties);
  }
}

export { Event, ExtensionEvent };
