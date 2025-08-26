import { after, before, describe, it } from 'node:test';
import { prisma } from '@core/db/db.js';
import axios from 'axios';
import { expect } from 'chai';
import jwt from 'jsonwebtoken';

const USER_TO_CREATE = {
  name: 'John Doe',
  email: 'john.doe@example.com',
  password: 'password123',
  birthDate: '1990-01-01T00:00:00.000Z',
};

describe('Get User', () => {
  before(async () => {
    await prisma.user.create({
      data: USER_TO_CREATE,
    });
  });

  it('should return user', async () => {
    const validToken = `Bearer ${jwt.sign({ userId: 'test-user-id' }, process.env.JWT_SECRET, { expiresIn: '1h' })}`;

    const user = (await prisma.user.findFirst({
      where: {
        email: USER_TO_CREATE.email,
      },
      omit: {
        password: true,
      },
    }))!;

    const formattedUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      birthDate: user.birthDate.toISOString(),
    };

    const response = await axios.get(`http://localhost:8080/users/${user.id}`, {
      headers: {
        Authorization: validToken,
      },
    });

    expect(response.status).to.equal(200);
    expect(response.data).to.deep.equal(formattedUser);
  });

  it('should return 404 for non-existent user', async () => {
    const validToken = `Bearer ${jwt.sign({ userId: 'test-user-id' }, process.env.JWT_SECRET, { expiresIn: '1h' })}`;

    const response = await axios.get(`http://localhost:8080/users/1234`, {
      headers: {
        Authorization: validToken,
      },
      validateStatus: () => true,
    });

    expect(response.status).to.equal(404);
    expect(response.data).to.deep.equal({
      message: 'User not found',
      code: 'USR_05',
      details: 'No user found with the given ID.',
    });
  });

  it('should fail for invalid id', async () => {
    const validToken = `Bearer ${jwt.sign({ userId: 'test-user-id' }, process.env.JWT_SECRET, { expiresIn: '1h' })}`;

    const response = await axios.get(`http://localhost:8080/users/invalid-id`, {
      headers: {
        Authorization: validToken,
      },
      validateStatus: () => true,
    });

    expect(response.status).to.equal(422);
    expect(response.data).to.deep.equal({
      code: 'USR_06',
      message: 'Invalid user ID format',
      details: 'User ID must be a valid integer.',
    });
  });

  after(async () => {
    await prisma.user.deleteMany({ where: { email: USER_TO_CREATE.email } });
  });
});
