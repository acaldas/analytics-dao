"use client";
import { useEffect, useMemo, useState } from "react";
import { Combobox } from "@headlessui/react";
import { UserFile, HostEventsCount } from "@analytics/shared/types";
import { CheckIcon } from "@heroicons/react/20/solid";
import Files from "components/files";
import { Button, Card } from "@analytics/ui";
import {
  addMultipleUserFileAccess,
  geUserFilesAccess,
  getUserFilePrice,
} from "@analytics/contracts";
import { BigNumber, ethers } from "ethers";
import { useAccount, useConnect, useSigner } from "wagmi";
import { InjectedConnector } from "@wagmi/core";
import EventsCount from "./events-count";
import { useRouter } from "next/navigation";

export default function FilesSelect({
  files,
  hostEventsCount,
}: {
  files: UserFile[];
  hostEventsCount: {
    hostName: string;
    count: number;
  }[];
}) {
  const router = useRouter();
  const [userTokens, setUserTokens] = useState<Array<Number> | undefined>(
    undefined
  );
  const [selectedFiles, setSelectedFiles] = useState(
    new Array<UserFile & { selected: boolean }>()
  );
  const [selectedHosts, setSelectedHosts] = useState(new Array<string>());
  const [query, setQuery] = useState("");
  const [price, setPrice] = useState<ethers.BigNumber>();
  const [fetchingPrice, setFetchingPrice] = useState(false);
  const [buyingFiles, setBuyingFiles] = useState(false);
  const { connect } = useConnect({
    connector: new InjectedConnector(),
  });
  const { address } = useAccount();
  useEffect(() => {
    connect();
  }, []);
  const { data: signer } = useSigner();

  useEffect(() => {
    if (!address) {
      setUserTokens([]);
    } else {
      geUserFilesAccess(address).then((tokens) => {
        setUserTokens(tokens.map((token) => token.toNumber()));
      });
    }
  }, [address]);

  const filteredHosts = useMemo(
    () =>
      query === ""
        ? hostEventsCount
        : hostEventsCount.filter((value) => {
            return value.hostName.toLowerCase().includes(query.toLowerCase());
          }),
    [hostEventsCount, query]
  );
  const filteredFiles = useMemo(
    () =>
      (userTokens === undefined
        ? []
        : selectedHosts.length
        ? files.filter((file) =>
            file.eventsCount.find((value) =>
              selectedHosts.includes(value.hostName)
            )
          )
        : files
      )
        .filter((file) => !selectedFiles.find((f) => f.id === file.id))
        .map((file) => ({
          ...file,
          selected: false,
          owned: userTokens?.includes(file.tokenId),
        })),
    [files, selectedHosts, selectedFiles, userTokens]
  );

  const [filePrice, setFilePrice] = useState<Record<number, ethers.BigNumber>>(
    {}
  );
  useEffect(() => {
    files.forEach(async (file) => {
      if (filePrice[file.tokenId]) {
        return;
      }
      const price = await getUserFilePrice(file.tokenId);
      setFilePrice((prices) => ({
        ...prices,
        [file.tokenId]: price,
      }));
    });
  }, [filteredFiles]);

  const selectedStats = useMemo(() => {
    return selectedFiles.reduce(
      (acc, curr) => ({
        events:
          acc.events +
          curr.eventsCount.reduce((total, value) => total + value.count, 0),
        hosts: acc.hosts + curr.eventsCount.length,
      }),
      { events: 0, hosts: 0 }
    );
  }, [selectedFiles]);

  const selectedEventsCount = useMemo(() => {
    return selectedFiles
      .reduce((acc, curr) => {
        curr.eventsCount.forEach((value) => {
          const index = acc.findIndex(
            (host) => host.hostName === value.hostName
          );
          if (index > -1) {
            acc[index].count += value.count;
          } else {
            acc.push({ ...value });
          }
        });
        return acc;
      }, new Array<HostEventsCount>())
      .sort((a, b) => b.count - a.count);
  }, [selectedFiles]);

  async function getTotalPrice(tokenIds: number[]) {
    return await Promise.all(
      tokenIds.map(async (id) => filePrice[id] || getUserFilePrice(id))
    ).then((prices) =>
      prices.reduce((curr, acc) => curr.add(acc), BigNumber.from(0))
    );
  }
  useEffect(() => {
    if (!selectedFiles.length) {
      setPrice(undefined);
      return;
    }
    setFetchingPrice(true);
    getTotalPrice(selectedFiles.map((f) => f.tokenId)).then((total) => {
      setPrice(total);
      setFetchingPrice(false);
    });
  }, [selectedFiles]);

  async function buyFiles(files: UserFile[]) {
    if (!signer) {
      alert("Connect wallet");
      return;
    }
    setBuyingFiles(true);
    try {
      const result = await addMultipleUserFileAccess(
        files.map((file) => file.tokenId),
        price!,
        signer
      );
      console.log(result.hash);
      await result.wait();
      router.push("/");
    } catch (error) {
      console.error(error);
    } finally {
      setBuyingFiles(false);
    }
  }

  return (
    <div
      className={`flex w-full h-full justify-between gap-8 ${
        buyingFiles && "animate-pulse pointer-events-none"
      }`}
    >
      <Card className="flex-1">
        <h2 className="text-2xl">Search uploads</h2>
        <div className="flex justify-between mt-2">
          <div className="flex flex-col">
            <Combobox
              value={selectedHosts}
              onChange={(val) => {
                setSelectedHosts(val);
              }}
              multiple
            >
              <Combobox.Input
                placeholder="Search host"
                className="rounded shadow-md focus:shadow-none ui-active:rounded-b-none border-0 text-sm"
                onChange={(event) => setQuery(event.target.value)}
              />
              <div className="relative">
                <Combobox.Options className="rounded-b overflow-hidden shadow-lg absolute w-full">
                  {filteredHosts.map((value) => (
                    <Combobox.Option
                      key={value.hostName}
                      value={value.hostName}
                      className={`py-1 px-4 text-sm bg-white ${
                        selectedHosts.includes(value.hostName)
                          ? "font-light"
                          : "font-bold bg-light"
                      }  hover:bg-light flex text-black flex-row items-center cursor-pointer border-b justify-between`}
                    >
                      <span className="max-w-[150px] text-ellipsis overflow-hidden whitespace-nowrap mr-2">
                        {value.hostName}
                      </span>
                      <span className="text-xs text-gray-500">
                        {value.count}
                      </span>
                    </Combobox.Option>
                  ))}
                </Combobox.Options>
              </div>
            </Combobox>
          </div>
          <Button
            onClick={() =>
              setSelectedFiles((files) => [
                ...files,
                ...filteredFiles
                  .filter((file) => !userTokens?.includes(file.tokenId))
                  .map((file) => ({
                    ...file,
                    selected: true,
                  })),
              ])
            }
          >
            Select all
          </Button>
        </div>
        <Files
          files={filteredFiles}
          noHosts
          onSelect={(file) =>
            setSelectedFiles((files) => [...files, { ...file, selected: true }])
          }
        />
      </Card>
      <Card className="flex-1">
        <h2 className="text-2xl">Selected uploads</h2>
        <div>
          <p className="flex justify-between mt-2">
            <span>
              Files: <b>{selectedFiles.length}</b>
            </span>
            <span>
              Events: <b>{selectedStats.events}</b>
            </span>
            <span>
              Hosts: <b>{selectedStats.hosts}</b>
            </span>
          </p>
          <p className="flex justify-end items-center mt-2 mb-4">
            <span className="mr-4">
              Total price:{" "}
              <b className={`${fetchingPrice && "animate-pulse"}`}>
                {price
                  ? ethers.utils.formatEther(price)
                  : fetchingPrice
                  ? "-"
                  : 0}{" "}
                tFil
              </b>
            </span>
            <Button
              onClick={() => buyFiles(selectedFiles)}
              disabled={fetchingPrice || !selectedFiles.length}
            >
              Buy files
            </Button>
          </p>
        </div>
        <Files
          files={selectedFiles}
          noHosts
          onSelect={(file) =>
            setSelectedFiles((files) =>
              files.filter((f) => f.tokenId !== file.tokenId)
            )
          }
        />
      </Card>
      <Card className="flex-1 flex flex-col">
        <h2 className="text-2xl">Selected events</h2>
        {selectedEventsCount.length && (
          <div className="flex-1 overflow-auto rounded-lg shadow mt-4 box-border">
            <EventsCount eventsCount={selectedEventsCount} />
          </div>
        )}
      </Card>
    </div>
  );
}
