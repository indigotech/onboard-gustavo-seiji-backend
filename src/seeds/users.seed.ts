import { hash } from '@core/encryption/hash.js';
import { UserDbDatasource } from '@data/users/user.db.datasource.js';
import type { UserInput } from '@models/users.model.js';
import { configureSeeds } from './config.seed.js';

const seedUsersDb = async () => {
  const data: UserInput[] = [];
  for (let i = 0; i < 50; i++) {
    data.push({
      email: `user${i}@example.com`,
      password: await hash('password123'),
      name: `User ${i}`,
      birthDate: '1990-01-01T00:00:00.000Z',
    });
  }

  await UserDbDatasource.createMany(data);
};

await configureSeeds();

seedUsersDb();
