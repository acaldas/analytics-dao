import React, { useMemo, useRef, useState } from "react";

import { Event } from "@analytics/shared/types";
import { Table, TableBody, TableCell, TableRow } from "./table";
import Button from "./button";

interface IProps {
  events: Event[];
  onDelete?: (event: Event) => void;
  maxHeight?: number;
}

function printDate(timestamp: string) {
  const date = new Date(Number.parseInt(timestamp));
  const today = new Date();
  let day = date.toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
  });
  if (
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth()
  ) {
    if (date.getDate() === today.getDate()) {
      day = "Today";
    } else if (date.getDate() === today.getDate() - 1) {
      day = "Yesterday";
    }
  }
  return `${day}, ${date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  })}`;
}

const EventList: React.FC<IProps> = ({ events, onDelete, maxHeight }) => {
  const [index, setIndex] = useState(10);
  const listRef = useRef<HTMLTableSectionElement>(null);
  const items = useMemo(() => events.slice(0, index), [events, index]);

  const onScroll = () => {
    if (listRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = listRef.current;
      if (scrollTop + clientHeight >= scrollHeight - 50) {
        setIndex((index) => Math.min(index + 10, events.length));
      }
    }
  };

  return (
    <Table>
      <TableBody
        className={`max-h-[${maxHeight}px] overflow-auto`}
        ref={listRef}
        onScroll={onScroll}
      >
        {items.map((e, i) => (
          <TableRow key={i} i={i}>
            <TableCell className="py-2">
              <div className="flex">
                <a
                  href={e.properties.url}
                  target="_blank"
                  className="leading-snug flex-1 overflow-hidden pr-2 text-[0.7rem]"
                >
                  <p>{printDate(e.timestamp)}</p>
                  <p className="whitespace-nowrap text-ellipsis overflow-hidden text-[0.8rem]">
                    {e.properties.title}
                  </p>
                  <p className="whitespace-nowrap text-ellipsis overflow-hidden text-gray-500 underline">
                    {e.properties.host}
                  </p>
                </a>
                <button
                  onClick={() => onDelete?.(e)}
                  className="flex-shrink-0 text-sm text-red-600 font-bold hover:drop-shadow"
                >
                  Delete
                </button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default EventList;
