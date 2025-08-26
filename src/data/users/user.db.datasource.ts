import { prisma } from '@core/db/db.js';
import type { User, UserInput } from '@domain/models/users.model.js';
import type { Prisma, User as UserEntity } from '@prisma/client';
import { mapUser } from './user.db.mapper.js';

const create = async (data: UserInput): Promise<User> => {
  const user = await prisma.user.create({
    data: {
      email: data.email,
      password: data.password,
      name: data.name,
      birthDate: new Date(Date.parse(data.birthDate)),
    },
  });

  return {
    addresses: [],
    ...user,
  };
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
  const user = await prisma.user.findUnique({
    where: {
      id,
    },
  });

  const addresses = await prisma.address.findMany({
    where: {
      userId: id,
    },
  });

  if (!user) {
    return null;
  }

  return mapUser(user, addresses);
};

const getList = async (limit: number, offset: number): Promise<User[]> => {
  const users = await prisma.user.findMany({
    take: limit,
    skip: offset,
    orderBy: {
      name: 'asc',
    },
  });

  const addresses = await prisma.address.findMany({
    where: {
      userId: {
        in: users.map(user => user.id),
      },
    },
  });

  return users.map(user =>
    mapUser(
      user,
      addresses.filter(address => address.userId === user.id),
    ),
  );
};

const getCount = async (): Promise<number> => {
  return prisma.user.count();
};

export const UserDbDatasource = {
  create,
  createMany,
  findByEmail,
  findById,
  getList,
  getCount,
};
