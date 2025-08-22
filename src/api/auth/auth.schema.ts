import type { User } from '@models/users.model.js';

export interface AuthRequestBody {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}
