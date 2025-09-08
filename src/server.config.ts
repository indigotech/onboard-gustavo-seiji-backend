import { addressRoutes } from '@api/address/address.routes.js';
import { authRoutes } from '@api/auth/auth.routes.js';
import { userRoutes } from '@api/users/users.routes.js';
import { configureDatabase } from '@core/db/db.js';
import { configureEnv } from '@core/env/env.js';
import fastify, { type FastifyInstance } from 'fastify';

export const configureServer = async (envPath: string): Promise<FastifyInstance> => {
  configureEnv(envPath);
  await configureDatabase();

  const server = await fastify({});

  await server.register(userRoutes, { prefix: '/users' });

  await server.register(authRoutes, { prefix: '/auth' });

  await server.register(addressRoutes, { prefix: '/address' });

  server.get('/hello', () => {
    return 'Hello World!';
  });

  try {
    const serverResponse = await server.listen({ port: 8080 });

    console.info(`Server listening at ${serverResponse}`);
  } catch (error: any) {
    console.error(`Error starting server: ${error.message}`);
  }

  return server;
};
