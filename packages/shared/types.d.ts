import { UserEventsFile, UserEventsFileHostCount } from "@prisma/client";

export type EventType = "page";

export type EventProperties = {
  host: string;
  hash: string;
  height: number;
  path: string;
  search: string;
  title: string;
  url: string;
  width: number;
};

export type Event = {
  type: EventType;
  properties: EventProperties;
  timestamp: string;
};

export type ExtensionEvent = {
  type: EventType;
  meta: {
    ts: Number;
  };
  properties: EventProperties;
  userId: string;
};

export type ExtensionStorage = {
  events: ExtensionEvent[];
  userId: string;
};

export type LighthouseFile = {
  name: string;
  hash: string;
  size: string | number;
};

export type UserFile = Omit<UserEventsFile, "timestamp"> & {
  eventsCount: UserEventsFileHostCount[];
} & { timestamp: string };
