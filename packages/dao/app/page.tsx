import React, { Suspense } from "react";
import dynamic from "next/dynamic";
import Upload from "components/upload";
import { fetchFiles, fetchHostEventsCount } from "@analytics/db";
import Hosts from "components/hosts";
import Uploads from "components/uploads";
import Logo from "components/logo";
import Files from "components/files";
import Card from "@analytics/ui/src/components/card";
import { getAddress } from "hooks/withIronSession";
import Login from "components/login";

const Profile = dynamic(() => import("../components/profile"), { ssr: false });

export default async function Home() {
  const [address, hostEventsCount, files] = await Promise.all([
    getAddress(),
    fetchHostEventsCount(),
    fetchFiles().then((files) =>
      files.map((file) => ({ ...file, timestamp: file.timestamp.toString() }))
    ),
  ]);

  return (
    <div className="flex flex-col h-full">
      <div className="mb-4 flex justify-between">
        <Logo size={100} title />
        <div>
          <Profile />
        </div>
      </div>
      <Card className="w-1/2">
        <div className="flex items-center">
          <h2 className="text-2xl mr-8">My Uploads</h2>
          <Upload />
        </div>
        {address ? (
          <Suspense fallback={<p>Loading uploads...</p>}>
            {/* @ts-expect-error Async Server Component */}
            <Uploads address={address} />
          </Suspense>
        ) : (
          <Login text="Sign with wallet to see your uploads" />
        )}
      </Card>
      <div className="flex flex-1 justify-between">
        <Card className="w-2/5 max-h-full flex flex-col">
          <Hosts hosts={hostEventsCount} />
        </Card>
        <Card className="w-2/5">
          <h2 className="text-2xl">All files</h2>
          <Files files={files} />
        </Card>
      </div>
    </div>
  );
}
