import { authUseCase } from '@domain/auth/auth.use-case.js';
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

    const user = await authUseCase(request.body);

    reply.code(200).send(user);
  });

  done();
};
