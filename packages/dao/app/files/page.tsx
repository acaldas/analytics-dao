import { fetchFiles, fetchHostEventsCount } from "@analytics/db";
import FilesSelect from "components/files-select";

export default async function Page() {
  const [hostEventsCount, files] = await Promise.all([
    fetchHostEventsCount(),
    fetchFiles().then((files) =>
      files.map((file) => ({ ...file, timestamp: file.timestamp.toString() }))
    ),
  ]);

  return <FilesSelect files={files} hostEventsCount={hostEventsCount} />;
}
