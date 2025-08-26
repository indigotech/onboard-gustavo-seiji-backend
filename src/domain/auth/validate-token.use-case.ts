import { CommonErrors } from '@models/error.model.js';
import jwt from 'jsonwebtoken';

export const validateTokenUseCase = (token?: string): void => {
  if (!token) {
    throw CommonErrors.NOT_AUTHENTICATED;
  }

  const tokenParts = token.split(' ');

  if (tokenParts[0] !== 'Bearer' || tokenParts.length !== 2 || !tokenParts[1]) {
    throw CommonErrors.INVALID_TOKEN;
  }
  let decodedToken: jwt.JwtPayload | string;
  try {
    decodedToken = jwt.verify(tokenParts[1], process.env.JWT_SECRET);
  } catch (error: any) {
    if (error.message === 'jwt expired') {
      throw CommonErrors.TOKEN_EXPIRED;
    }
    throw CommonErrors.INVALID_TOKEN;
  }
  if (typeof decodedToken === 'string' || !decodedToken.exp || !decodedToken.userId) {
    throw CommonErrors.INVALID_TOKEN;
  }

  if (decodedToken.exp < Date.now() / 1000) {
    throw CommonErrors.TOKEN_EXPIRED;
  }
};
