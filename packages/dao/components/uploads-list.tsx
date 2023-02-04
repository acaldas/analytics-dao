"use client";

import { UserFile } from "@analytics/shared/types";
// import { Accordion, Table } from "@analytics/ui";

export default function UploadsList({ uploads }: { uploads: UserFile[] }) {
  return <p></p>;
  //   <Accordion collapseAll={true} className="mt-4">
  //     {uploads.map((upload) => (
  //       <Accordion.Panel key={upload.tokenId} className="border-red">
  //         <Accordion.Title className="bg-dark hover:bg-dark border-red">
  //           <div className="w-full flex justify-between">
  //             <b>{new Date(upload.timestamp).toLocaleDateString()}</b>
  //             <span className="mx-6">
  //               Events:{" "}
  //               {upload.eventsCount.reduce(
  //                 (acc, curr) => (acc += curr.count),
  //                 0
  //               )}
  //             </span>
  //             <span>Hosts: {upload.eventsCount.length}</span>
  //           </div>
  //         </Accordion.Title>
  //         <Accordion.Content>
  //           <p>
  //             <b>
  //               <a
  //                 href={`/api/file/${upload.cId}`}
  //                 download={`${upload.cId}.json`}
  //                 className="text-yellow button text-underline"
  //               >
  //                 Download file
  //               </a>
  //             </b>
  //           </p>
  //           <p>
  //             <b>Deal Id:</b> {upload.dealId || "-"}
  //           </p>
  //           <Table>
  //             <Table.Head className="bg-dark table table-fixed w-full">
  //               <Table.HeadCell className="w-3/4">Host</Table.HeadCell>
  //               <Table.HeadCell>Events</Table.HeadCell>
  //             </Table.Head>
  //             <Table.Body className="divide-y max-h-[200px] overflow-auto block">
  //               {upload.eventsCount.map((row) => (
  //                 <Table.Row
  //                   className="table table-fixed w-full"
  //                   key={row.hostName}
  //                 >
  //                   <Table.Cell className="w-3/4">
  //                     <a
  //                       href={`http://${row.hostName}`}
  //                       className="underline block whitespace-nowrap text-ellipsis overflow-hidden w-full"
  //                     >
  //                       {row.hostName.split("www.").pop()}
  //                     </a>
  //                   </Table.Cell>
  //                   <Table.Cell>{row.count}</Table.Cell>
  //                 </Table.Row>
  //               ))}
  //             </Table.Body>
  //           </Table>
  //         </Accordion.Content>
  //       </Accordion.Panel>
  //     ))}
  //   </Accordion>
  // );
}
