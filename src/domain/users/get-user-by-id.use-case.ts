import { UserDbDatasource } from '@data/users/user.db.datasource.js';
import { UserErrors } from '@models/users.model.js';

export const getUserByIdUseCase = async (id: string) => {
  const userIdInt = parseInt(id, 10);

  if (Number.isNaN(userIdInt)) {
    throw UserErrors.INVALID_USER_ID;
  }

  const user = await UserDbDatasource.findById(userIdInt);

  if (!user) {
    throw UserErrors.USER_ID_NOT_FOUND;
  }

  return user;
};
