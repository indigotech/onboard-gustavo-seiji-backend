import { hash } from '@core/encryption/hash.js';
import { UserDbDatasource } from '@data/users/user.db.datasource.js';
import { type User, UserErrors, type UserInput } from '@domain/models/users.model.js';
import { CommonErrors } from '@models/error.model.js';
import jwt from 'jsonwebtoken';

const LETTER_REGEX = /[a-z]/i;

const DIGIT_REGEX = /\d/;

const EMAIL_REGEX = /([@][a-z]+.com)/i;

export const createUserUseCase = async (data: UserInput, token?: string): Promise<User> => {
  validateFields(data);
  validateToken(token);

  const user = await UserDbDatasource.findByEmail(data.email);

  if (user) {
    throw UserErrors.ALREADY_EXISTS;
  }

  data.password = await hash(data.password);

  return UserDbDatasource.create(data);
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

const validateToken = (token?: string): void => {
  if (!token) {
    throw CommonErrors.NOT_AUTHENTICATED;
  }

  const tokenParts = token.split(' ');

  if (tokenParts[0] !== 'Bearer' || tokenParts.length !== 2 || !tokenParts[1]) {
    throw CommonErrors.INVALID_TOKEN;
  }
  let decodedToken: jwt.JwtPayload | string;
  try {
    decodedToken = jwt.verify(tokenParts[1], process.env.JWT_SECRET);
  } catch (error: any) {
    if (error.message === 'jwt expired') {
      throw CommonErrors.TOKEN_EXPIRED;
    }
    throw CommonErrors.INVALID_TOKEN;
  }
  if (typeof decodedToken === 'string' || !decodedToken.exp || !decodedToken.userId) {
    throw CommonErrors.INVALID_TOKEN;
  }

  if (decodedToken.exp < Date.now() / 1000) {
    throw CommonErrors.TOKEN_EXPIRED;
  }
};
