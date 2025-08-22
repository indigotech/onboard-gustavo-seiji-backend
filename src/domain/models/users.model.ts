import type { BaseError } from './error.model.js';

export interface User {
  id: number;
  email: string;
  name: string;
  birthDate: Date;
}

export interface UserInput {
  email: string;
  password: string;
  name: string;
  birthDate: string;
}

export const UserErrors: Record<string, BaseError> = {
  ALREADY_EXISTS: {
    code: 'USR_01',
    message: 'User already exists',
    details: 'The email address is already in use.',
    status: 400,
  },
  INVALID_PASSWORD: {
    code: 'USR_02',
    message: 'Invalid password',
    details: 'Password must contain at least one letter and one digit, and at least 6 characters long.',
    status: 400,
  },
  INVALID_EMAIL: {
    code: 'USR_03',
    message: 'Invalid email format',
    details: 'Email must be a valid email address.',
    status: 400,
  },
  INVALID_BIRTHDATE: {
    code: 'USR_04',
    message: 'Invalid birthdate format',
    details: 'Birthdate must be a valid date in the past.',
    status: 400,
  },
};
