import { configureServer } from '@core/db/config.js';
import fastify from 'fastify';
import { userRoutes } from './api/users/users.routes.js';

await configureServer();

const server = fastify();

server.register(userRoutes, { prefix: '/users' });

server.listen({ port: 8080 }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.info(`Server listening at ${address}`);
});
