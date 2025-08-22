import { hash } from '@core/encryption/hash.js';
import { UserDbDatasource } from '@data/users/user.db.datasource.js';
import { type Auth, AuthErrors, type AuthInput } from '@models/auth.model.js';
import jwt from 'jsonwebtoken';

export const COMMON_EXPIRATION_TIME = 60 * 30;
export const REMEMBER_ME_EXPIRATION_TIME = 60 * 60 * 24 * 7;

export const authUseCase = async (data: AuthInput): Promise<Auth> => {
  const user = await UserDbDatasource.findByEmail(data.email);

  data.password = await hash(data.password);

  if (!user || user.password !== data.password) {
    throw AuthErrors.INVALID_CREDENTIALS;
  }

  let expirationTime: number;

  if (data.rememberMe) {
    expirationTime = REMEMBER_ME_EXPIRATION_TIME;
  } else {
    expirationTime = COMMON_EXPIRATION_TIME;
  }

  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
    expiresIn: expirationTime,
  });

  return {
    user,
    token,
  };
};
