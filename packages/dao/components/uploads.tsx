import React from "react";

import { fetchUserUploads } from "@analytics/db/queries/user";
import { getUserTokenIds } from "@analytics/contracts";
import UploadsList from "./uploads-list";

export default async function Uploads({ address }: { address: string }) {
  const tokenIds = await getUserTokenIds(address);
  const uploads = await fetchUserUploads(tokenIds).then((files) =>
    files.map((file) => ({ ...file, timestamp: file.timestamp.toString() }))
  );

  return <UploadsList uploads={uploads} />;
}
