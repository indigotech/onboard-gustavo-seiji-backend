import { after, describe, it } from 'node:test';
import { prisma } from '@core/db/db.js';
import type { UserInput } from '@models/users.model.js';
import axios from 'axios';
import { expect } from 'chai';

const USER_TO_CREATE = {
  name: 'John Doe',
  email: 'john.doe@example.com',
  password: 'password123',
  birthDate: '1990-01-01T00:00:00.000Z',
};

const sendTestRequest = async (data: UserInput) => {
  return axios.post('http://localhost:8080/users', data, {
    validateStatus: () => true,
  });
};

describe('User Creation', () => {
  it('should create a user', async () => {
    const response = await sendTestRequest(USER_TO_CREATE);

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
    const response = await sendTestRequest({
      ...USER_TO_CREATE,
      email: 'invalid-email',
    });

    expect(response.status).to.equal(422);

    expect(response.data).to.deep.equal({
      code: 'USR_03',
      message: 'Invalid email format',
      details: 'Email must be a valid email address.',
    });
  });

  it('should return invalid password error', async () => {
    const responseShortPassword = await sendTestRequest({
      ...USER_TO_CREATE,
      password: 'short',
    });

    expect(responseShortPassword.status).to.equal(422);
    expect(responseShortPassword.data).to.deep.equal({
      code: 'USR_02',
      message: 'Invalid password',
      details: 'Password must contain at least one letter and one digit, and at least 6 characters long.',
    });

    const responseNumberPassword = await sendTestRequest({
      ...USER_TO_CREATE,
      password: '123456',
    });

    expect(responseNumberPassword.status).to.equal(422);
    expect(responseNumberPassword.data).to.deep.equal({
      code: 'USR_02',
      message: 'Invalid password',
      details: 'Password must contain at least one letter and one digit, and at least 6 characters long.',
    });

    const response = await sendTestRequest({
      ...USER_TO_CREATE,
      password: 'password',
    });

    expect(response.status).to.equal(422);
    expect(response.data).to.deep.equal({
      code: 'USR_02',
      message: 'Invalid password',
      details: 'Password must contain at least one letter and one digit, and at least 6 characters long.',
    });
  });

  it('should return invalid birthdate error', async () => {
    const responseInvalidDate = await sendTestRequest({
      ...USER_TO_CREATE,
      birthDate: 'invalid-date',
    });

    expect(responseInvalidDate.status).to.equal(422);
    expect(responseInvalidDate.data).to.deep.equal({
      code: 'USR_04',
      message: 'Invalid birthdate format',
      details: 'Birthdate must be a valid date in the past.',
    });

    const futureDate = new Date();
    futureDate.setFullYear(futureDate.getFullYear() + 1);

    const responseFutureDate = await sendTestRequest({
      ...USER_TO_CREATE,
      birthDate: futureDate.toISOString(),
    });

    expect(responseFutureDate.status).to.equal(422);
    expect(responseFutureDate.data).to.deep.equal({
      code: 'USR_04',
      message: 'Invalid birthdate format',
      details: 'Birthdate must be a valid date in the past.',
    });
  });

  it('should return user already exists error', async () => {
    await sendTestRequest(USER_TO_CREATE);

    const response = await sendTestRequest(USER_TO_CREATE);

    expect(response.status).to.equal(409);
    expect(response.data).to.deep.equal({
      code: 'USR_01',
      message: 'User already exists',
      details: 'The email address is already in use.',
    });
  });

  after(async () => {
    await prisma.user.deleteMany({ where: { email: USER_TO_CREATE.email } });
  });
});
