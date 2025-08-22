import { after, describe, it } from 'node:test';
import { prisma } from '@core/db/db.js';
import axios from 'axios';
import { assert, expect } from 'chai';

const USER_TO_CREATE = {
  name: 'John Doe',
  email: 'john.doe@example.com',
  password: 'password123',
  birthDate: '1990-01-01T00:00:00.000Z',
};

describe('User Creation', () => {
  it('should create a user', async () => {
    const response = await axios.post('http://localhost:8080/users', USER_TO_CREATE);

    expect(response.status).to.equal(201);
    expect(response.data).to.have.property('id');
    const userId = response.data.id;

    const userInDb = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    assert(userInDb !== null);

    expect(userInDb.name).to.equal(USER_TO_CREATE.name);
    expect(userInDb.email).to.equal(USER_TO_CREATE.email);
    expect(userInDb.birthDate.toISOString()).to.equal(USER_TO_CREATE.birthDate);
  });

  after(async () => {
    await prisma.user.deleteMany({ where: { email: USER_TO_CREATE.email } });
  });
});
