import type { BaseError } from './error.model.js';
import type { User } from './users.model.js';

export interface AuthInput {
  email: string;
  password: string;
  rememberMe: boolean;
}

export interface Auth {
  user: User;
  token: string;
}

export const AuthErrors: Record<string, BaseError> = {
  INVALID_CREDENTIALS: {
    code: 'LGN_01',
    message: 'Invalid credentials.',
    details: 'The email or password provided is incorrect.',
    status: 401,
    name: 'InvalidCredentialsError',
  },
};
