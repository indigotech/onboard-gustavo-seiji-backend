import { after, describe, it } from 'node:test';
import { prisma } from '@core/db/db.js';
import axios from 'axios';
import { expect } from 'chai';

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

    const expectedResponse = {
      id: userId,
      name: USER_TO_CREATE.name,
      email: USER_TO_CREATE.email,
      birthDate: USER_TO_CREATE.birthDate,
    };

    expect(response.data).to.deep.eq(expectedResponse);

    const userInDb = (await prisma.user.findUnique({
      where: {
        id: userId,
      },
    }))!;

    expect(userInDb.name).to.equal(USER_TO_CREATE.name);
    expect(userInDb.email).to.equal(USER_TO_CREATE.email);
    expect(userInDb.birthDate.toISOString()).to.equal(USER_TO_CREATE.birthDate);
  });

  after(async () => {
    await prisma.user.deleteMany({ where: { email: USER_TO_CREATE.email } });
  });
});

describe('User Creation Errors', () => {
  it('should return invalid email error', async () => {
    try {
      await axios.post('http://localhost:8080/users', {
        ...USER_TO_CREATE,
        email: 'invalid-email',
      });
    } catch (error: any) {
      expect(error.response.data).to.deep.equal({
        code: 'USR_03',
        message: 'Invalid email format',
        details: 'Email must be a valid email address.',
      });
    }
  });

  it('should return invalid password error', async () => {
    try {
      await axios.post('http://localhost:8080/users', {
        ...USER_TO_CREATE,
        password: 'short',
      });
    } catch (error: any) {
      expect(error.response.data).to.deep.equal({
        code: 'USR_02',
        message: 'Invalid password',
        details: 'Password must contain at least one letter and one digit, and at least 6 characters long.',
      });
    }

    try {
      await axios.post('http://localhost:8080/users', {
        ...USER_TO_CREATE,
        password: '123456',
      });
    } catch (error: any) {
      expect(error.response.data).to.deep.equal({
        code: 'USR_02',
        message: 'Invalid password',
        details: 'Password must contain at least one letter and one digit, and at least 6 characters long.',
      });
    }

    try {
      await axios.post('http://localhost:8080/users', {
        ...USER_TO_CREATE,
        password: 'password',
      });
    } catch (error: any) {
      expect(error.response.data).to.deep.equal({
        code: 'USR_02',
        message: 'Invalid password',
        details: 'Password must contain at least one letter and one digit, and at least 6 characters long.',
      });
    }
  });

  it('should return invalid birthdate error', async () => {
    try {
      await axios.post('http://localhost:8080/users', {
        ...USER_TO_CREATE,
        birthDate: 'invalid-date',
      });
    } catch (error: any) {
      expect(error.response.data).to.deep.equal({
        code: 'USR_04',
        message: 'Invalid birthdate format',
        details: 'Birthdate must be a valid date in the past.',
      });
    }

    const futureDate = new Date();
    futureDate.setFullYear(futureDate.getFullYear() + 1);

    try {
      await axios.post('http://localhost:8080/users', {
        ...USER_TO_CREATE,
        birthDate: futureDate.toISOString(),
      });
    } catch (error: any) {
      expect(error.response.data).to.deep.equal({
        code: 'USR_04',
        message: 'Invalid birthdate format',
        details: 'Birthdate must be a valid date in the past.',
      });
    }
  });

  it('should return user already exists error', async () => {
    await axios.post('http://localhost:8080/users', USER_TO_CREATE);

    try {
      await axios.post('http://localhost:8080/users', USER_TO_CREATE);
    } catch (error: any) {
      expect(error.response.data).to.deep.equal({
        code: 'USR_01',
        message: 'User already exists',
        details: 'The email address is already in use.',
      });
    }
  });

  after(async () => {
    await prisma.user.deleteMany({ where: { email: USER_TO_CREATE.email } });
  });
});
