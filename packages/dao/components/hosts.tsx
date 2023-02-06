"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
} from "@analytics/ui";
import React from "react";

interface IProps {
  hosts: { hostName: string; count: number }[];
}

const Hosts: React.FC<IProps> = ({ hosts }) => (
  <Table className="block mt-4">
    <TableHead>
      <TableHeadCell className="w-2/3 text-2xl">Host</TableHeadCell>
      <TableHeadCell className="text-2xl">Events</TableHeadCell>
    </TableHead>
    <TableBody className="max-h-[90%]">
      {hosts.map((row, i) => (
        <TableRow i={i} key={row.hostName}>
          <TableCell className="w-2/3">
            <a
              href={`http://${row.hostName}`}
              className="underline block whitespace-nowrap text-ellipsis overflow-hidden w-full"
            >
              {row.hostName.split("www.").pop()}
            </a>
          </TableCell>
          <TableCell>
            <div className="flex justify-between">
              <span className="pl-1">{row.count}</span>
            </div>
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
);

export default Hosts;
