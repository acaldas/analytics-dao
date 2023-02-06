"use client";
import { extensionEventToEvent } from "@analytics/shared";
import { Card, EventList, Settings } from "@analytics/ui";
import Upload from "components/upload";
import useAnalytics from "hooks/useAnalytics";
import { useMemo } from "react";
import { useRouter } from "next/navigation";

export default function Events() {
  const router = useRouter();
  const analytics = useAnalytics();
  const events = useMemo(
    () => analytics?.events.map(extensionEventToEvent).reverse(),
    [analytics?.events]
  );
  return (
    <Card className="w-[60rem] mx-auto">
      <div>
        <h1 className="text-2xl font-bold">Upload events</h1>
        <div className="flex justify-center mt-4 mb-8">
          <Upload onUpload={() => router.push("/")} />
        </div>
      </div>
      <div className="mb-6">
        <p className="text-xl pl-2 mb-2">Settings:</p>
        <div className="max-h-[50vh] overflow-auto">
          {analytics?.settings && (
            <Settings settings={analytics.settings} updateSetting={() => {}} />
          )}
        </div>
      </div>
      <div className="">
        <p className="text-xl pl-2 mb-2">Events:</p>
        <div className="max-h-[30vh] overflow-auto">
          {events && <EventList events={events} />}
        </div>
      </div>
    </Card>
  );
}
