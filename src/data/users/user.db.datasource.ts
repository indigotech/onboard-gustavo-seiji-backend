import { prismaQuery } from '@core/db/db.js';
import type { UserData } from '@models/users.model.js';
import type { PrismaClient, User } from '@prisma/client';

export const createUser = async (data: UserData): Promise<User> => {
  return prismaQuery<User>(async (prisma: PrismaClient) => {
    return prisma.user.create({
      data: {
        email: data.email,
        password: data.password,
        name: data.name,
        birthDate: new Date(Date.parse(data.birthdate)),
      },
    });
  });
};

export const findUserByEmail = async (email: string): Promise<User | null> => {
  return prismaQuery<User | null>(async (prisma: PrismaClient) => {
    return prisma.user.findUnique({
      where: {
        email,
      },
    });
  });
};

export const UserDatasource = {
  createUser,
  findUserByEmail,
};
