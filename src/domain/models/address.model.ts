import type { BaseError } from './error.model.js';

export interface AddressInput {
  userId: number;
  zipCode: string;
  street: string;
  streetNumber: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
}

export interface Address {
  id: number;
  zipCode: string;
  street: string;
  streetNumber: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
}

export const AddressErrors: Record<string, BaseError> = {
  USER_NOT_FOUND: {
    code: 'ADR_01',
    message: 'User id not found',
    name: 'UserNotFoundError',
    details: 'No user found with the given ID.',
    status: 404,
  },
};
