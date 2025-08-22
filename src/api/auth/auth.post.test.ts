import { after, before, describe, it } from 'node:test';
import { prisma } from '@core/db/db.js';
import { hash } from '@core/encryption/hash.js';
import axios from 'axios';
import { assert, expect } from 'chai';

const USER_TO_CREATE = {
  name: 'John Doe',
  email: 'john.doe@example.com',
  password: 'password123',
  birthDate: '1990-01-01T00:00:00.000Z',
};

describe('User Authentication', () => {
  before(async () => {
    await prisma.user.create({
      data: { ...USER_TO_CREATE, password: await hash(USER_TO_CREATE.password) },
    });
  });

  it('should authenticate a user', async () => {
    const response = await axios.post('http://localhost:8080/auth', {
      email: USER_TO_CREATE.email,
      password: USER_TO_CREATE.password,
    });

    expect(response.status).to.equal(201);

    const user = response.data.user;

    const dbUser = await prisma.user.findFirst({
      where: { email: USER_TO_CREATE.email },
    });

    expect(response.data).to.have.property('token'); //TODO: test using .to.be.deep.eq after token implementation
    assert(dbUser !== null);
    assert(user !== null);
    expect(user.id).to.equal(dbUser.id);
    expect(user.name).to.equal(dbUser.name);
    expect(user.email).to.equal(dbUser.email);
    expect(user.birthDate).to.equal(dbUser.birthDate.toISOString());
  });

  after(async () => {
    await prisma.user.deleteMany({ where: { email: USER_TO_CREATE.email } });
  });
});
