import { createUserUseCase } from '@domain/users/create-user.use-case.js';
import type {
  FastifyInstance,
  FastifyPluginCallback,
  FastifyReply,
  FastifyRequest,
  RegisterOptions,
  RouteGenericInterface,
} from 'fastify';

interface UserData {
  email: string;
  password: string;
  name: string;
  birthdate: string;
}

interface CreateUserRoute extends RouteGenericInterface {
  Body: UserData;
}

export const userRoutes: FastifyPluginCallback = (
  fastify: FastifyInstance,
  _: RegisterOptions,
  done: (err?: Error) => void,
) => {
  fastify.post<CreateUserRoute>('/', async (request: FastifyRequest<CreateUserRoute>, reply: FastifyReply) => {
    console.info('Received user creation request with data', request.body);

    const user = await createUserUseCase(request.body);

    reply.code(201).send(user);
  });

  done();
};
