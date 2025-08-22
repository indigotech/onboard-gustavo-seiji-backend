import type { Auth, AuthInput } from '@models/auth.model.js';

export interface AuthRequestBody extends AuthInput {}

export interface AuthResponse extends Auth {}
