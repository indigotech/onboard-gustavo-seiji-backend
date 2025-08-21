import { configureDatabase } from './db.js';

export const configureServer = async (): Promise<void> => {
  await configureDatabase();
};
