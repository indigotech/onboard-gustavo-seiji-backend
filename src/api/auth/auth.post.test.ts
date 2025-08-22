import { after, before, describe, it } from 'node:test';
import { prisma } from '@core/db/db.js';
import { hash } from '@core/encryption/hash.js';
import { REMEMBER_ME_EXPIRATION_TIME } from '@domain/auth/auth.use-case.js';
import axios from 'axios';
import { assert, expect } from 'chai';
import jwt from 'jsonwebtoken';

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

    const dbUser = (await prisma.user.findFirst({
      where: { email: USER_TO_CREATE.email },
    }))!;

    expect(response.data).to.be.deep.eq({
      token: response.data.token,
      user: {
        id: dbUser.id,
        email: dbUser.email,
        name: dbUser.name,
        birthDate: dbUser.birthDate.toISOString(),
      },
    });
  });

  it('should have extended token duration', async () => {
    const response = await axios.post('http://localhost:8080/auth', {
      email: USER_TO_CREATE.email,
      password: USER_TO_CREATE.password,
      rememberMe: true,
    });

    expect(response.status).to.equal(201);
    expect(response.data).to.have.property('token');

    const decodedToken = jwt.verify(response.data.token, process.env.JWT_SECRET);
    assert(typeof decodedToken !== 'string');

    const currentTime = Math.floor(Date.now() / 1000);
    expect(decodedToken.exp).to.be.equal(currentTime + REMEMBER_ME_EXPIRATION_TIME);
  });

  after(async () => {
    await prisma.user.deleteMany({ where: { email: USER_TO_CREATE.email } });
  });
});
