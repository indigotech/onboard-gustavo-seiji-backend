import { errorHandler } from '@api/common/error-handler.js';
import { createUserUseCase } from '@domain/users/create-user.use-case.js';
import type { BaseError } from '@models/error.model.js';
import type {
  FastifyInstance,
  FastifyPluginCallback,
  FastifyReply,
  FastifyRequest,
  RegisterOptions,
  RouteGenericInterface,
} from 'fastify';
import type { CreateUserRequestBody, CreateUserResponse } from './users.schema.js';

interface CreateUserRoute extends RouteGenericInterface {
  Body: CreateUserRequestBody;
  Reply: CreateUserResponse;
}

export const userRoutes: FastifyPluginCallback = (
  fastify: FastifyInstance,
  _: RegisterOptions,
  done: (err?: Error) => void,
) => {
  fastify.post<CreateUserRoute>('/', async (request: FastifyRequest<CreateUserRoute>, reply: FastifyReply) => {
    console.info('Received user creation request with data', request.body);

    const user = await createUserUseCase(request.body, request.headers.authorization);

    const userResponse: CreateUserResponse = {
      id: user.id,
      name: user.name,
      email: user.email,
      birthDate: user.birthDate,
    };

    reply.code(201).send(userResponse);
  });

  fastify.setErrorHandler<BaseError>(errorHandler);

  done();
};
