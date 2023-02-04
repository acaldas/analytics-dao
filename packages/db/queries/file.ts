import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function fetchFiles() {
  const result = await prisma.userEventsFile.findMany({
    include: {
      eventsCount: {
        orderBy: { count: "desc" },
      },
      hosts: true,
    },
    orderBy: {
      tokenId: "desc",
    },
  });
  return result;
}
