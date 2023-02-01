"use client";
import { extensionEventToEvent } from "@analytics/shared";
import { EventList } from "@analytics/ui";
import useAnalytics from "hooks/useAnalytics";
import { useMemo } from "react";

export default function Events() {
  const analytics = useAnalytics();
  const events = useMemo(
    () => analytics?.events.map(extensionEventToEvent),
    [analytics?.events]
  );
  return <div>{events && <EventList events={events} />}</div>;
}
