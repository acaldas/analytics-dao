import { Prisma, PrismaClient } from "@prisma/client";
import { Event, getHostEventsCount } from "@analytics/shared";
import { LighthouseFile } from "@analytics/shared/types";
export * as db from "@prisma/client";

const prisma = new PrismaClient();

export function disconnect() {
  return prisma.$disconnect();
}

export async function getUser(userId: string) {
  const user = await prisma.user.findUnique({ where: { userId } });
  return user;
}

export async function upsertUser(newUser: Prisma.UserCreateInput) {
  const user = await prisma.user.upsert({
    where: { userId: newUser.userId },
    create: newUser,
    update: newUser,
  });
  return user;
}

export async function createHosts(newHosts: Prisma.HostCreateManyInput[]) {
  const user = await prisma.host.createMany({
    data: newHosts,
    skipDuplicates: true,
  });
  return user;
}

export async function validateUserEvents(userId: string, events: Event[]) {
  return true;
}

export async function indexUserEvents(
  userId: string,
  tokenId: number,
  events: Event[],
  file: LighthouseFile,
  metadataCId: string
) {
  const hosts = getHostEventsCount(events);

  const userFile = await prisma.userEventsFile.create({
    data: {
      tokenId,
      cId: file.name,
      metadataCId,
      user: {
        connectOrCreate: {
          where: {
            userId,
          },
          create: { userId },
        },
      },
      hosts: {
        connectOrCreate: Object.keys(hosts).map((host) => ({
          where: { name: host },
          create: { name: host },
        })),
      },

      size: +file.size,
      hash: file.hash,
      eventsCount: {
        createMany: {
          data: Object.keys(hosts).map((hostName) => ({
            hostName,
            userId,
            count: hosts[hostName],
          })),
        },
      },
    },
  });

  return userFile;
}

export async function fetchHostEventsCount() {
  return prisma.userEventsFileHostCount.groupBy({
    by: ["hostName", "count"],
    orderBy: {
      count: "desc",
    },
    take: 10,
  });
}

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
