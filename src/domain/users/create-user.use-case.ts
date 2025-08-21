import { UserDatasource, UserDbDatasource } from '@data/users/user.db.datasource.js';
import type { User, UserData, UserInput } from '@models/users.model.js';
import type { User } from '@prisma/client';
import { hash } from 'bcrypt';

const LETTER_REGEX = /[a-z]/i;

const DIGIT_REGEX = /\d/g;

const EMAIL_REGEX = /([@][a-z]+.com)/i;

const hashPassword = async (password: string): Promise<string> => {
  const salt = process.env.ENCRYPTION_SALT;

  return hash(password, salt);
};

export const createUserUseCase = async (data: UserData): Promise<User> => {
  validateFields(data);
  
  const user = await UserDatasource.findUserByEmail(data.email);

  if (user) {
    throw new Error('User already exists');
  }

  data.password = await hashPassword(data.password);

  return UserDbDatasource.create(data);
};

const validateFields = (data: UserInput): void => {
  if (data.password.length < 6) {
    throw new Error('Password must be at least 6 characters long');
  }

  if (!LETTER_REGEX.test(data.password) || !DIGIT_REGEX.test(data.password)) {
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
