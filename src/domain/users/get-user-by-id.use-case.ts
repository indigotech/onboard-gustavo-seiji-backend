import { UserDbDatasource } from '@data/users/user.db.datasource.js';
import { UserErrors } from '@models/users.model.js';
import { validateToken } from '@src/util/validate-token.util.js';

export const getUserByIdUseCase = (id: string, token?: string) => {
  validateToken(token);

  const userIdInt = parseInt(id, 10);

  if (Number.isNaN(userIdInt)) {
    throw UserErrors.INVALID_USER_ID;
  }

  const user = UserDbDatasource.findById(userIdInt);

  if (!user) {
    throw UserErrors.USER_ID_NOT_FOUND;
  }

  return user;
};
