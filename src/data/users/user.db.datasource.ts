import { prisma } from '@core/db/db.js';
import type { User, UserInput } from '@domain/models/users.model.js';

export const create = async (data: UserInput): Promise<User> => {
  return prisma.user.create({
    data: {
      email: data.email,
      password: data.password,
      name: data.name,
      birthDate: new Date(Date.parse(data.birthDate)),
    },
  });
};

export const findByEmail = async (email: string): Promise<User | null> => {
  return prisma.user.findUnique({
    where: {
      email,
    },
  });
};

export const UserDbDatasource = {
  create,
  findByEmail,
};
