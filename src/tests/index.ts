import { after, before } from 'node:test';
import { prisma } from '@core/db/db.js';
import { configureServer, server } from '@src/server.config.js';

before(async () => {
  await configureServer('test.env');
});

import '@api/users/users.post.test.js';

after(async () => {
  await prisma.$disconnect();
  await server.close();
});
