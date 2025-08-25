import { prisma } from '@core/db/db.js';
import type { User, UserInput } from '@domain/models/users.model.js';
import type { User as UserEntity } from '@prisma/client';

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

export const UserDbDatasource = {
  create,
  findByEmail,
  findById,
};
