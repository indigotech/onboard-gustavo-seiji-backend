import { hash } from '@core/encryption/hash.js';
import { UserDbDatasource } from '@data/users/user.db.datasource.js';
import { configureSeeds } from './config.seed.js';

const seedUsersDb = async () => {
  for (let i = 0; i < 50; i++) {
    await UserDbDatasource.create({
      email: `user${i}@example.com`,
      password: await hash('password123'),
      name: `User ${i}`,
      birthDate: '1990-01-01T00:00:00.000Z',
    });
  }
};

configureSeeds();

seedUsersDb();
