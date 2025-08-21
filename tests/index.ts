import { before } from 'node:test';
import { configureServer } from '@src/server.config.js';

before(() => {
  configureServer();
});
