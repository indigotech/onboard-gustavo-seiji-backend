import { UserDatasource } from '@data/users/user.db.datasource.js';
import type { UserData } from '@models/users.model.js';
import type { User } from '@prisma/client';

export const createUserUseCase = async (data: UserData): Promise<User> => {
  const user = await UserDatasource.findByEmail(data.email);

  if (user) {
    throw new Error('User already exists');
  }

  return UserDatasource.createUser(data);
};
