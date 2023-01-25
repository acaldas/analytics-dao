import { Prisma, PrismaClient } from "@prisma/client";
import { Event } from "@analytics/shared";
import { UserFile } from "@analytics/shared/types";

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
  events: Event[],
  file: UserFile
) {
  const hosts = events.reduce((acc, curr) => {
    const count = acc[curr.properties.host] || 0;
    acc[curr.properties.host] = count + 1;
    return acc;
  }, new Map<string, number>());
  console.log(
    file.name,
    await prisma.userEventsFile.findUnique({ where: { cId: file.name } })
  );

  const userFile = await prisma.userEventsFile.create({
    data: {
      cId: file.name,
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

  // const eventsCount = await prisma.userEventsFileHostCount.createMany({
  //   data: Object.keys(hosts).map((hostName) => ({
  //     cId: userFile.cId,
  //     hostName,
  //     userId,
  //     count: hosts[hostName],
  //   })),
  // });
  // console.log(eventsCount);
  return userFile;
}
