declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DATABASE_URL: string;
      ENCRYPTION_SALT: string;
      JWT_SECRET: string;
    }
  }
}

// If this file has no import/export statements (i.e. is a script)
// convert it into a module by adding an empty export statement.
export {};
