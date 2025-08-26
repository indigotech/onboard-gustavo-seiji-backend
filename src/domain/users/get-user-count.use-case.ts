import { UserDbDatasource } from '@data/users/user.db.datasource.js';

export const getUserCountUseCase = async () => {
  return UserDbDatasource.getCount();
};
