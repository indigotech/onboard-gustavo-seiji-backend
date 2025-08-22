import { errorHandler } from '@api/common/error-handler.js';
import { authUseCase } from '@domain/auth/auth.use-case.js';
import type { BaseError } from '@models/error.model.js';
import type {
  FastifyInstance,
  FastifyPluginCallback,
  FastifyReply,
  FastifyRequest,
  RegisterOptions,
  RouteGenericInterface,
} from 'fastify';
import type { AuthRequestBody, AuthResponse } from './auth.schema.js';

interface AuthRoute extends RouteGenericInterface {
  Body: AuthRequestBody;
  Reply: AuthResponse;
}

export const authRoutes: FastifyPluginCallback = (
  fastify: FastifyInstance,
  _: RegisterOptions,
  done: (err?: Error) => void,
) => {
  fastify.post<AuthRoute>('/', async (request: FastifyRequest<AuthRoute>, reply: FastifyReply) => {
    console.info('Received auth request');

    const authData = await authUseCase(request.body);

    const authResponse: AuthResponse = {
      token: authData.token,
      user: {
        id: authData.user.id,
        email: authData.user.email,
        name: authData.user.name,
        birthDate: authData.user.birthDate,
      },
    };

    reply.code(200).send(authResponse);
  });

  fastify.setErrorHandler<BaseError>(errorHandler);

  done();
};
