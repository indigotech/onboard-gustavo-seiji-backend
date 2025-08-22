import { prisma } from '@core/db/db.js';
import { type Auth, AuthErrors, type AuthInput } from '@models/auth.model.js';

export const authDbDatasource = async (data: AuthInput): Promise<Auth> => {
  const user = await prisma.user.findFirst({ where: { email: data.email, password: data.password } });

  if (!user) {
    throw AuthErrors.INVALID_CREDENTIALS;
  }

  return {
    user,
    token: 'the_token',
  };
};
