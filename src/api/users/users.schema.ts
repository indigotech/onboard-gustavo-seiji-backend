import type { Pagination } from '@api/common/pagination.schema.js';
import type { User, UserInput } from '@domain/models/users.model.js';

export interface CreateUserRequestBody extends UserInput {}

export interface UserResponse extends User {}

export interface GetUserPathParams {
  id: string;
}
export interface GetUserListQueryParams {
  limit?: number;
  page: number;
}

export interface GetUserListResponse {
  users: UserResponse[];
  pagination: Pagination;
}

export const getUserListSchema = {
  querystring: { type: 'object', properties: { page: { type: 'number' }, limit: { type: 'number' } } },
};
