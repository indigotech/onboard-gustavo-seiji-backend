import { PrismaClient } from '@prisma/client';

export let prisma: PrismaClient;

export const configureDatabase = async (): Promise<void> => {
  prisma = new PrismaClient();

  await prisma.$connect();
};
