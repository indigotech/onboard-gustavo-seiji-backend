import { UserDbDatasource } from '@data/users/user.db.datasource.js';
import type { User, UserInput } from '@models/users.model.js';
import { hash } from 'bcrypt';

const LETTER_REGEX = /[a-z]/i;

const DIGIT_REGEX = /\d/;

const EMAIL_REGEX = /([@][a-z]+.com)/i;

export const createUserUseCase = async (data: UserInput): Promise<User> => {
  validateFields(data);

  const user = await UserDbDatasource.findByEmail(data.email);

  if (user) {
    throw new Error('User already exists');
  }

  data.password = await hashPassword(data.password);

  return UserDbDatasource.create(data);
};

const hashPassword = async (password: string): Promise<string> => {
  const salt = process.env.ENCRYPTION_SALT;

  return hash(password, salt);
};

const validateFields = (data: UserInput): void => {
  if (data.password.length < 6) {
    throw new Error('Password must be at least 6 characters long');
  }

  if (!LETTER_REGEX.test(data.password) || !DIGIT_REGEX.test(data.password)) {
    console.log(data.password);
    console.log(!LETTER_REGEX.test(data.password));
    console.log(!DIGIT_REGEX.test(data.password));
    console.log(!LETTER_REGEX.test(data.password) || !DIGIT_REGEX.test(data.password));
    throw new Error('Password must contain at least one letter and one digit');
  }

  if (!EMAIL_REGEX.test(data.email)) {
    throw new Error('Invalid email format');
  }

  const formattedBirthdate = new Date(data.birthDate);
  if (Number.isNaN(formattedBirthdate.getTime())) {
    throw new Error('Invalid birthdate format');
  }

  if (formattedBirthdate > new Date()) {
    throw new Error('Birthdate must be in the past');
  }
};
