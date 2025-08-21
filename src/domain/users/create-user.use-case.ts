import { UserDbDatasource } from '@data/users/user.db.datasource.js';
import type { User, UserInput } from '@models/users.model.js';

export const createUserUseCase = async (data: UserInput): Promise<User> => {
  const user = await UserDbDatasource.findByEmail(data.email);

  if (user) {
    throw new Error('User already exists');
  }

  return UserDbDatasource.create(data);
};
