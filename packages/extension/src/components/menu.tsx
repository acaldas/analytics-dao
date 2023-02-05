import { useEffect, useMemo, useRef, useState } from "react";
import { extensionEventToEvent } from "@analytics/shared";
import {
  ExtensionStorage,
  Event,
  ExtensionSettingKey,
} from "@analytics/shared/types";
import {
  Accordion,
  AccordionButton,
  AccordionPanel,
  EventList,
} from "@analytics/ui";
import Settings from "./settings";

export default function Menu() {
  const [data, setData] = useState<ExtensionStorage>();
  const eventsRef = useRef<HTMLButtonElement>(null);
  const settingsRef = useRef<HTMLButtonElement>(null);
  const [accordionOpen, setAccordionOpen] = useState<
    "events" | "settings" | undefined
  >(undefined);

  useEffect(() => {
    chrome.storage?.local.onChanged.addListener((changes) => {
      const newData = { ...data };
      if (changes.events?.newValue) {
        newData.events = changes.events.newValue;
      } else if (changes.settings?.newValue) {
        newData.settings = changes.settings.newValue;
      }

      setData((data) => ({ ...data, ...(newData as any) }));
    });
    chrome.storage?.local.get().then((data) => setData(data as any));
  }, []);

  const events = useMemo(
    () => data?.events.map(extensionEventToEvent).reverse(),
    [data]
  );

  async function deleteEvent(event: Event) {
    if (!chrome.storage) {
      return;
    }
    const data = (await chrome.storage?.local.get()) as ExtensionStorage;
    const newEvents = data.events.filter(
      (e) =>
        !(
          (e.meta?.ts.toString() ?? (e as any as Event).timestamp) ===
            event.timestamp && e.properties.url === event.properties.url
        )
    );
    await chrome.storage?.local.set({ ...data, events: newEvents });
  }

  function onOpenAccordion(accordion: "events" | "settings") {
    if (accordion === "events" && accordionOpen === "settings") {
      settingsRef.current?.click();
    } else if (accordion === "settings" && accordionOpen === "events") {
      eventsRef.current?.click();
    }
    setAccordionOpen(accordionOpen === accordion ? undefined : accordion);
  }

  function updateSetting(
    key: ExtensionSettingKey,
    enabled: boolean,
    value?: string
  ) {
    chrome.storage?.local.set({
      settings: {
        ...data?.settings,
        [key]: { ...data?.settings[key], enabled, value },
      },
    });
  }

  return (
    <div className="mt-4">
      <Accordion>
        <AccordionButton
          className="pl-4 text-lg bg-dark"
          ref={eventsRef}
          onClick={() => onOpenAccordion("events")}
        >
          <span>
            Events: <b>{data?.events.length}</b>
          </span>
        </AccordionButton>
        <AccordionPanel>
          {events ? (
            <EventList events={events} onDelete={deleteEvent} maxHeight={200} />
          ) : (
            <p>No events found</p>
          )}
        </AccordionPanel>
      </Accordion>
      <Accordion>
        <AccordionButton
          className="pl-4 text-lg bg-dark"
          ref={settingsRef}
          onClick={() => onOpenAccordion("settings")}
        >
          Settings
        </AccordionButton>
        <AccordionPanel>
          {data?.settings && (
            <Settings settings={data.settings} updateSetting={updateSetting} />
          )}
        </AccordionPanel>
      </Accordion>
    </div>
  );
}
