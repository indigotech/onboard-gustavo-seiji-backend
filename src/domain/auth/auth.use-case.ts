import { hash } from '@core/encryption/hash.js';
import { UserDbDatasource } from '@data/users/user.db.datasource.js';
import { type Auth, AuthErrors, type AuthInput } from '@models/auth.model.js';

export const authUseCase = async (data: AuthInput): Promise<Auth> => {
  const user = await UserDbDatasource.findByEmail(data.email);

  data.password = await hash(data.password);

  if (!user || user.password !== data.password) {
    throw AuthErrors.INVALID_CREDENTIALS;
  }

  return {
    user,
    token: 'the_token',
  };
};
