import { UserDbDatasource } from '@data/users/user.db.datasource.js';
import { UserErrors } from '@models/users.model.js';

export const getUserListUseCase = async (limit: number, page: number) => {
  if (page <= 0) {
    throw UserErrors.PAGE_NOT_FOUND;
  }

  const offset = (page - 1) * limit;

  return UserDbDatasource.getList(limit, offset);
};
