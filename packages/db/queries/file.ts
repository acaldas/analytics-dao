import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function fetchFiles(take?: number) {
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
    take,
  });
  return result;
}
