import { NextApiRequest, NextApiResponse } from "next";
import { Event } from "@analytics/shared/types";

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  const events: Event[] = request.body.events;
  if (!events) {
    response.status(400).json({ error: "No events found" });
  }
  const result = await fetch("https://app.posthog.com/batch", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      api_key: "phc_OzdMQIVPiC2dlKz5rS9J1qxAhzGwZJ68yMZz7VNRB9w",
      batch: events.map((event: Record<string, any>) => ({
        event: "$pageview",
        properties: {
          distinct_id: event.userId,
          $current_url: event.properties.url,
          $pathname: event.properties.path,
          $lib: "LytDAO",
        },
        timestamp: new Date(event.meta.ts).toISOString(),
      })),
    }),
  });
  const resp = await result.json();
  response.status(result.status).json(resp);
}
