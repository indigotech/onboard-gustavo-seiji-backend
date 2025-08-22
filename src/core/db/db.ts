import { PrismaClient } from '@prisma/client';

export let prisma: PrismaClient;

export const configureDatabase = async (): Promise<void> => {
  prisma = new PrismaClient({ datasourceUrl: process.env.DATABASE_URL });

  await prisma.$connect();
};
