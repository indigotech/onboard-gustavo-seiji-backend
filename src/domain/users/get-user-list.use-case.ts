import { UserDbDatasource } from '@data/users/user.db.datasource.js';
import { validateToken } from '@src/util/validate-token.util.js';

export const getUserListUseCase = async (limit: number, token?: string) => {
  validateToken(token);

  return UserDbDatasource.getList(limit);
};
