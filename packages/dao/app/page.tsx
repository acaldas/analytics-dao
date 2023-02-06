import React, { Suspense } from "react";
import dynamic from "next/dynamic";
import Upload from "components/upload";
import { fetchFiles, fetchHostEventsCount } from "@analytics/db";
import Hosts from "components/hosts";
import Uploads from "components/uploads";
import Files from "components/files";
import Card from "@analytics/ui/src/components/card";
import { getAddress } from "hooks/withIronSession";
import Login from "components/login";
import Link from "next/link";

export default async function Home() {
  const [address, hostEventsCount, files] = await Promise.all([
    getAddress(),
    fetchHostEventsCount(),
    fetchFiles(10).then((files) =>
      files.map((file) => ({ ...file, timestamp: file.timestamp.toString() }))
    ),
  ]);

  return (
    <div className="h-full overflow-hidden flex flex-col">
      <Card className="w-1/2">
        <div className="flex items-center">
          <p>
            Get access to{" "}
            <Link href="/files">
              <span className="underline font-bold">user analytics</span>
            </Link>
            <span className="px-2">or</span>
            <Link href="/upload">
              <span className="underline font-bold">upload your data</span>
            </Link>{" "}
          </p>
        </div>
        {/* {address ? (
          <Suspense fallback={<p>Loading uploads...</p>}>
            {/* @ts-expect-error Async Server Component */}
        {/* <Uploads address={address} />
          </Suspense> */}
        {/* ) : ( */}
        {/* <Login text="Sign with wallet to see your uploads" /> */}
        {/* )} } */}
      </Card>
      <div className="flex flex-1 justify-between items-stretch overflow-hidden gap-8">
        <Card className="flex-1 max-h-full flex flex-col overflow-hidden">
          <Hosts hosts={hostEventsCount} />
        </Card>
        <Card className="flex-1">
          <h2 className="text-2xl font-bold">Latest Uploads</h2>
          <Files files={files} />
        </Card>
      </div>
    </div>
  );
}
