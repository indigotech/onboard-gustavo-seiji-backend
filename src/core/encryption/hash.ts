import bcrypt from 'bcrypt';

export const hash = async (password: string): Promise<string> => {
  const salt = process.env.ENCRYPTION_SALT;

  return bcrypt.hash(password, salt);
};
