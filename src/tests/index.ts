import { after, before } from 'node:test';
import { prisma } from '@core/db/db.js';
import { configureServer } from '@src/server.config.js';
import type { FastifyInstance } from 'fastify';

let server: FastifyInstance;

before(async () => {
  server = await configureServer('test.env');
});

import '@api/users/users.post.test.js';
import '@api/users/users.get.test.js';
import '@api/users/users-list.get.test.js';
import '@api/auth/auth.post.test.js';

after(async () => {
  await prisma.$disconnect();
  await server.close();
});
