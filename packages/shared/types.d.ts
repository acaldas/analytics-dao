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

export type ExtensionSettingKey =
  | "location"
  | "gender"
  | "age"
  | "locale"
  | "OS"
  | "timezone"
  | "browser";

export type ExtensionSettingValue = {
  enabled: boolean;
  value?: string;
};

export type ExtensionSettings = Record<
  ExtensionSettingKey,
  ExtensionSettingValue
>;

export type ExtensionStorage = {
  events: ExtensionEvent[];
  userId: string;
  recording: boolean;
  settings: ExtensionSettings;
};

export type LighthouseFile = {
  name: string;
  hash: string;
  size: string | number;
};

export type HostEventsCount = { id: number; hostName: string; count: number };

export type UserFile = Omit<UserEventsFile, "timestamp"> & {
  eventsCount: UserEventsFileHostCount[];
} & { timestamp: string };
