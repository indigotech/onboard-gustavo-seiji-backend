import { UserDbDatasource } from '@data/users/user.db.datasource.js';
import { UserErrors } from '@models/users.model.js';

interface GetUserListInput {
  limit: number;
  page: number;
}

export const getUserListUseCase = async (input: GetUserListInput) => {
  const { limit, page } = input;

  if (page <= 0 || !Number.isInteger(page)) {
    throw UserErrors.INVALID_PAGE;
  }

  const offset = (page - 1) * limit;

  return UserDbDatasource.getList(limit, offset);
};
