import React from "react";
import dynamic from "next/dynamic";
import Upload from "components/upload";
import { fetchHostEventsCount } from "@analytics/db";
import Hosts from "components/hosts";
import Uploads from "components/uploads";
import Logo from "components/logo";

const Profile = dynamic(() => import("../components/profile"), { ssr: false });

export default async function Home() {
  const hostEventsCount = await fetchHostEventsCount();
  return (
    <div className="flex flex-col h-full">
      <div className="mb-4 flex justify-between">
        <Logo size={100} title />
        <div>
          <Profile />
        </div>
      </div>
      <div className="flex flex-1">
        <div className="w-1/2 max-h-full flex flex-col">
          <h2 className="text-2xl">Hosts</h2>
          <Hosts hosts={hostEventsCount} />
        </div>
        <div className="w-1/2">
          <div className="flex items-center">
            <h2 className="text-2xl mr-8">My Uploads</h2>
            <Upload />
          </div>
          <Uploads />
        </div>
      </div>
    </div>
  );
}
