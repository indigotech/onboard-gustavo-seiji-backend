import { before } from 'node:test';
import { configureServer } from '@src/server.config.js';

before(async () => {
  await configureServer();
});

import './users/users.post.js';
