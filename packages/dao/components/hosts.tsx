"use client";

import { Table } from "@analytics/ui/";
import React from "react";

interface IProps {
  hosts: { hostName: string; count: number }[];
}

const Hosts: React.FC<IProps> = ({ hosts }) => (
  <Table className="mt-4 overflow-hidden">
    <Table.Head className="bg-backgroundDark table table-fixed w-full">
      <Table.HeadCell className="w-3/4">Host</Table.HeadCell>
      <Table.HeadCell>Events</Table.HeadCell>
    </Table.Head>
    <Table.Body className="divide-y overflow-auto block">
      {hosts.map((row) => (
        <Table.Row className="table table-fixed w-full" key={row.hostName}>
          <Table.Cell className="w-3/4">
            <a
              href={`http://${row.hostName}`}
              className="underline block whitespace-nowrap text-ellipsis overflow-hidden w-full"
            >
              {row.hostName.split("www.").pop()}
            </a>
          </Table.Cell>
          <Table.Cell>{row.count}</Table.Cell>
        </Table.Row>
      ))}
    </Table.Body>
  </Table>
);

export default Hosts;
