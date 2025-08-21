import type { User, UserInput } from '@models/users.model.js';

export interface CreateUserRequestBody extends UserInput {}

export interface CreateUserResponse extends User {}
