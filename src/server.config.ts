import { userRoutes } from '@api/users/users.routes.js';
import { configureDatabase } from '@core/db/db.js';
import fastify from 'fastify';

export const configureServer = async (): Promise<void> => {
  await configureDatabase();

  const server = await fastify();

  await server.register(userRoutes, { prefix: '/users' });

  server.get('/hello', () => {
    return 'Hello World!';
  });

  try {
    const serverResponse = await server.listen({ port: 8080 });

    console.info(`Server listening at ${serverResponse}`);
  } catch (error: any) {
    console.error(`Error starting server: ${error.message}`);
  }
};
