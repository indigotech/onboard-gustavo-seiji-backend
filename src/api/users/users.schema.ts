import type { User, UserInput } from '@domain/models/users.model.js';

export interface CreateUserRequestBody extends UserInput {}

export interface CreateUserResponse extends User {}
