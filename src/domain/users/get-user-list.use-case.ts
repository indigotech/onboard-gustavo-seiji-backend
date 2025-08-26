import { UserDbDatasource } from '@data/users/user.db.datasource.js';

export const getUserListUseCase = async (limit: number) => {
  return UserDbDatasource.getList(limit);
};
