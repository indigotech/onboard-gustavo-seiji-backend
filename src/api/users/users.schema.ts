import type { User, UserInput } from '@domain/models/users.model.js';

export interface CreateUserRequestBody extends UserInput {}

export interface UserResponse extends User {}

export interface GetUserPathParams {
  id: string;
}
export interface GetUserListInput {
  limit?: number;
}
