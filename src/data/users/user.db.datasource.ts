import { prisma } from '@core/db/db.js';
import type { User, UserInput } from '@domain/models/users.model.js';
import type { Prisma, User as UserEntity } from '@prisma/client';

const create = async (data: UserInput): Promise<User> => {
  return prisma.user.create({
    data: {
      email: data.email,
      password: data.password,
      name: data.name,
      birthDate: new Date(Date.parse(data.birthDate)),
    },
  });
};

const createMany = async (data: UserInput[]): Promise<Prisma.BatchPayload> => {
  return prisma.user.createMany({
    data: data.map(user => ({
      email: user.email,
      password: user.password,
      name: user.name,
      birthDate: new Date(Date.parse(user.birthDate)),
    })),
  });
};

const findByEmail = async (email: string): Promise<UserEntity | null> => {
  return prisma.user.findUnique({
    where: {
      email,
    },
  });
};

const findById = async (id: number): Promise<User | null> => {
  return prisma.user.findUnique({
    where: {
      id,
    },
  });
};

const getList = async (limit: number): Promise<User[]> => {
  return prisma.user.findMany({
    take: limit,
    orderBy: {
      name: 'asc',
    },
  });
};

export const UserDbDatasource = {
  create,
  createMany,
  findByEmail,
  findById,
  getList,
};
