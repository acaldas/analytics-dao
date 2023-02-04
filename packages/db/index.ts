import { Prisma, PrismaClient } from "@prisma/client";
import { getHostEventsCount } from "@analytics/shared";
import { Event } from "@analytics/shared/types";
import { LighthouseFile } from "@analytics/shared/types";
export * as db from "@prisma/client";
export * from "./queries/user";
export * from "./queries/file";

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
  return prisma.userEventsFileHostCount
    .groupBy({
      by: ["hostName"],
      orderBy: {
        _sum: {
          count: "desc",
        },
      },
      _sum: {
        count: true,
      },
      take: 10,
    })
    .then((result) =>
      result.map((value) => ({
        hostName: value.hostName,
        count: value._sum.count || 0,
      }))
    );
}
