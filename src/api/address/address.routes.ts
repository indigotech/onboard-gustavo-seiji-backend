import { errorHandler } from '@api/common/error-handler.js';
import { createAddressUseCase } from '@domain/address/create-address.use-case.js';
import { validateTokenUseCase } from '@domain/auth/validate-token.use-case.js';
import type {
  FastifyInstance,
  FastifyPluginCallback,
  FastifyReply,
  FastifyRequest,
  RegisterOptions,
  RouteGenericInterface,
} from 'fastify';
import type { CreateAddressRequestBody } from './address.schema.js';

interface CreateAddressRoute extends RouteGenericInterface {
  Body: CreateAddressRequestBody;
}

export const addressRoutes: FastifyPluginCallback = (
  fastify: FastifyInstance,
  _: RegisterOptions,
  done: (err?: Error) => void,
) => {
  fastify.post<CreateAddressRoute>('/', async (request: FastifyRequest<CreateAddressRoute>, reply: FastifyReply) => {
    validateTokenUseCase(request.headers.authorization);

    const addressData = request.body;
    const address = await createAddressUseCase(addressData);
    reply.status(201).send(address);
  });

  fastify.setErrorHandler(errorHandler);
  done();
};
