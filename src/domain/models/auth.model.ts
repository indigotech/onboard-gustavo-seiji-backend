import type { BaseError } from './error.model.js';
import type { User } from './users.model.js';

export interface AuthInput {
  email: string;
  password: string;
}

export interface Auth {
  user: User;
  token: string;
}

export const AuthErrors: Record<string, BaseError> = {
  INVALID_CREDENTIALS: {
    code: 'AUT_01',
    message: 'Invalid credentials.',
    details: 'The email or password provided is incorrect.',
  },
};
