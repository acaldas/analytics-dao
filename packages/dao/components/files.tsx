"use client";

import React, { useEffect, useState } from "react";
import { UserFile } from "@analytics/shared/types";
import {
  Accordion,
  AccordionButton,
  AccordionPanel,
  Button,
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@analytics/ui";
import { getUserFilePrice } from "@analytics/contracts";
import { ethers } from "ethers";
import EventsCount from "./events-count";

type File = UserFile & { selected?: boolean; owned?: boolean };

const Files: React.FC<{
  files: Array<File>;
  noHosts?: boolean;
  onSelect?: (file: File) => void;
}> = ({ files, noHosts, onSelect }) => {
  const [filePrice, setFilePrice] = useState<Record<number, string>>({});

  useEffect(() => {
    files.forEach(async (file) => {
      if (filePrice[file.tokenId]) {
        return;
      }
      const price = await getUserFilePrice(file.tokenId);
      setFilePrice((prices) => ({
        ...prices,
        [file.tokenId]: ethers.utils.formatEther(price),
      }));
    });
  }, [files]);

  return (
    <div className="mt-4">
      <div className="shadow rounded-lg overflow-auto max-h-[540px]">
        {files.map((file) => (
          <Accordion key={file.tokenId} className="">
            <AccordionButton className="" noChevron={onSelect !== undefined}>
              <div className="w-full flex items-center justify-between text-sm">
                <b className="text-left pl-5">
                  {new Date(file.timestamp).toLocaleDateString("en-US")}
                </b>
                {!noHosts && (
                  <span className="mx-6">
                    Hosts: <b>{file.eventsCount.length}</b>
                  </span>
                )}
                <span className="">
                  Events:{" "}
                  <b>
                    {file.eventsCount.reduce(
                      (acc, curr) => (acc += curr.count),
                      0
                    )}
                  </b>
                </span>
                <span className="">
                  Price: <b>{filePrice[file.tokenId] ?? "-"} tFil</b>
                </span>
                {file.selected !== undefined && (
                  <span className="pl-2">
                    {file.owned ? (
                      <span>Owned</span>
                    ) : (
                      <Button
                        className="text-xs"
                        style={{ padding: "2px 6px" }}
                        onClick={(e) => {
                          onSelect?.(file);
                          e.preventDefault();
                        }}
                      >
                        {file.selected ? "Remove" : "Select"}
                      </Button>
                    )}
                  </span>
                )}
              </div>
            </AccordionButton>
            <AccordionPanel className="bg-lighter">
              <EventsCount
                eventsCount={file.eventsCount}
                className="max-h-[300px]"
              />
            </AccordionPanel>
          </Accordion>
        ))}
      </div>
    </div>
  );
};

export default Files;
