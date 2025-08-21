import { prisma } from '@core/db/db.js';
import type { UserData } from '@models/users.model.js';
import type { User } from '@prisma/client';

export const createUser = async (data: UserData): Promise<User> => {
  return prisma.user.create({
    data: {
      email: data.email,
      password: data.password,
      name: data.name,
      birthDate: new Date(Date.parse(data.birthdate)),
    },
  });
};

export const findUserByEmail = async (email: string): Promise<User | null> => {
  return prisma.user.findUnique({
    where: {
      email,
    },
  });
};

export const UserDatasource = {
  createUser,
  findUserByEmail,
};
