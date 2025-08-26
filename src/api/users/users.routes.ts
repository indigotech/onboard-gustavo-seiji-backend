import { errorHandler } from '@api/common/error-handler.js';
import { validateTokenUseCase } from '@domain/auth/validate-token.use-case.js';
import { createUserUseCase } from '@domain/users/create-user.use-case.js';
import { getUserByIdUseCase } from '@domain/users/get-user-by-id.use-case.js';
import { getUserListUseCase } from '@domain/users/get-user-list.use-case.js';
import type { BaseError } from '@models/error.model.js';
import type {
  FastifyInstance,
  FastifyPluginCallback,
  FastifyReply,
  FastifyRequest,
  RegisterOptions,
  RouteGenericInterface,
} from 'fastify';
import type { CreateUserRequestBody, GetUserListQueryParams, GetUserPathParams, UserResponse } from './users.schema.js';

interface CreateUserRoute extends RouteGenericInterface {
  Body: CreateUserRequestBody;
  Reply: UserResponse;
}

interface GetUserRoute extends RouteGenericInterface {
  Params: GetUserPathParams;
  Reply: UserResponse;
}

interface GetUserListRoute extends RouteGenericInterface {
  Querystring: GetUserListQueryParams;
  Reply: UserResponse[];
}

export const userRoutes: FastifyPluginCallback = (
  fastify: FastifyInstance,
  _: RegisterOptions,
  done: (err?: Error) => void,
) => {
  fastify.post<CreateUserRoute>('/', async (request: FastifyRequest<CreateUserRoute>, reply: FastifyReply) => {
    console.info('Received user creation request with data', request.body);

    validateTokenUseCase(request.headers.authorization);

    const user = await createUserUseCase(request.body);

    const userResponse: UserResponse = {
      id: user.id,
      name: user.name,
      email: user.email,
      birthDate: user.birthDate,
    };

    reply.code(201).send(userResponse);
  });

  fastify.get<GetUserRoute>(
    '/:id',
    async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
      validateTokenUseCase(request.headers.authorization);
      const user = await getUserByIdUseCase(request.params.id);

      if (!user) {
        return reply.code(404).send({ message: 'User not found' });
      }

      const userResponse: UserResponse = {
        id: user.id,
        name: user.name,
        email: user.email,
        birthDate: user.birthDate,
      };

      reply.send(userResponse);
    },
  );

  fastify.get<GetUserListRoute>('/', async (request: FastifyRequest<GetUserListRoute>, reply: FastifyReply) => {
    validateTokenUseCase(request.headers.authorization);

    const limit = request.query.limit || 10;

    const users: UserResponse[] = await getUserListUseCase(limit);

    const response = users.map(user => {
      return {
        id: user.id,
        name: user.name,
        email: user.email,
        birthDate: user.birthDate,
      };
    });

    reply.code(200).send(response);
  });

  fastify.setErrorHandler<BaseError>(errorHandler);

  done();
};
