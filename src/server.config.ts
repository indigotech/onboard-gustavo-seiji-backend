import { userRoutes } from '@api/users/users.routes.js';
import { configureDatabase } from '@core/db/db.js';
import fastify from 'fastify';

export const configureServer = async (): Promise<void> => {
  await configureDatabase();

  const server = fastify();

  server.register(userRoutes, { prefix: '/users' });

  server.get('/hello', () => {
    return 'Hello World!';
  });

  server.listen({ port: 8080 }, (err, address) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    console.info(`Server listening at ${address}`);
  });
};
