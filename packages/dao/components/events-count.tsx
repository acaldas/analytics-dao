import React from "react";
import { HostEventsCount } from "@analytics/shared/types";
import { Table, TableBody, TableCell, TableRow } from "@analytics/ui";

export default function EventsCount({
  eventsCount,
  className,
}: {
  className?: string;
  eventsCount: HostEventsCount[];
}) {
  return (
    <Table>
      <TableBody className={className}>
        {eventsCount.map((row, i) => (
          <TableRow i={i} key={row.hostName}>
            <TableCell className="w-3/4">
              <a
                href={`http://${row.hostName}`}
                className="underline block whitespace-nowrap text-ellipsis overflow-hidden w-full"
              >
                {row.hostName.split("www.").pop()}
              </a>
            </TableCell>
            <TableCell>{row.count}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
