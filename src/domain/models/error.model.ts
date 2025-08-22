export interface BaseError extends Error {
  code: string;
  message: string;
  details?: string;
  status: number;
}

export const CommonErrors: Record<string, BaseError> = {
  NOT_AUTHENTICATED: {
    code: 'ERR_01',
    message: 'User is not authenticated',
    details: 'The user must be authenticated to access this resource',
    status: 401,
  },
  TOKEN_EXPIRED: {
    code: 'ERR_02',
    message: 'User token has expired',
    details: 'The user must obtain a new token to access this resource',
    status: 401,
  },
  INVALID_TOKEN: {
    code: 'ERR_03',
    message: 'User token is invalid',
    details: 'The user must provide a valid token to access this resource',
    status: 401,
  },
};
