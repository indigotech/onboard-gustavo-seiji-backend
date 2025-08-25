import { configureDatabase } from '@core/db/db.js';
import { configureEnv } from '@core/env/env.js';

export const configureSeeds = async (envPath?: string) => {
  await configureDatabase();
  await configureEnv(envPath || '.env');
};
