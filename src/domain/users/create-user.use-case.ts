import { UserDbDatasource } from '@data/users/user.db.datasource.js';
import type { User, UserInput } from '@models/users.model.js';

const LETTER_REGEX = /[a-z]/i;

const DIGIT_REGEX = /\d/g;

export const createUserUseCase = async (data: UserInput): Promise<User> => {
  const user = await UserDbDatasource.findByEmail(data.email);

  if (user) {
    throw new Error('User already exists');
  }

  if (data.password.length < 6) {
    throw new Error('Password must be at least 6 characters long');
  }

  if (!LETTER_REGEX.test(data.password) || !DIGIT_REGEX.test(data.password)) {
    throw new Error('Password must contain at least one letter and one digit');
  }

  return UserDbDatasource.create(data);
};
