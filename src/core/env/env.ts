import { configDotenv } from 'dotenv';

export const configureEnv = (envPath: string) => {
  configDotenv({ path: envPath, override: true });
};
