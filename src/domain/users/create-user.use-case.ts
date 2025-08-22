import { UserDbDatasource } from '@data/users/user.db.datasource.js';
import { type User, UserErrors, type UserInput } from '@domain/models/users.model.js';
import { hash } from 'bcrypt';

const LETTER_REGEX = /[a-z]/i;

const DIGIT_REGEX = /\d/;

const EMAIL_REGEX = /([@][a-z]+.com)/i;

export const createUserUseCase = async (data: UserInput): Promise<User> => {
  validateFields(data);

  const user = await UserDbDatasource.findByEmail(data.email);

  if (user) {
    throw UserErrors.ALREADY_EXISTS;
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
    throw UserErrors.INVALID_PASSWORD;
  }

  if (!LETTER_REGEX.test(data.password) || !DIGIT_REGEX.test(data.password)) {
    throw UserErrors.INVALID_PASSWORD;
  }

  if (!EMAIL_REGEX.test(data.email)) {
    throw UserErrors.INVALID_EMAIL;
  }

  const formattedBirthdate = new Date(data.birthDate);
  if (Number.isNaN(formattedBirthdate.getTime())) {
    throw UserErrors.INVALID_BIRTHDATE;
  }

  if (formattedBirthdate > new Date()) {
    throw UserErrors.INVALID_BIRTHDATE;
  }
};
