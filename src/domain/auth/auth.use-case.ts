import { hash } from '@core/encryption/hash.js';
import { authDbDatasource } from '@data/auth/auth.db.datasource.js';
import type { Auth, AuthInput } from '@models/auth.model.js';

export const authUseCase = async (data: AuthInput): Promise<Auth> => {
  data.password = await hash(data.password);

  return authDbDatasource(data);
};
