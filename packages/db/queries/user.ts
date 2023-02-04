import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function fetchUserUploads(tokenIds: number[]) {
  const result = await prisma.userEventsFile.findMany({
    where: {
      tokenId: { in: tokenIds },
    },
    include: {
      eventsCount: {
        orderBy: { count: "desc" },
      },
    },
    orderBy: {
      tokenId: "desc",
    },
  });
  return result;
}
