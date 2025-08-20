import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const prismaQuery = async <T>(query: (prisma: PrismaClient) => Promise<T>): Promise<T> => {
  await prisma.$connect();

  try {
    const data = await query(prisma);

    await prisma.$disconnect();

    return data;
  } catch (err) {
    console.error(err);

    await prisma.$disconnect();

    throw new Error('Database query failed');
  }
};
