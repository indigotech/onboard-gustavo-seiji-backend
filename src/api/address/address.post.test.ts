import { after, before, describe, it } from 'node:test';
import { prisma } from '@core/db/db.js';
import type { AddressInput } from '@models/address.model.js';
import axios from 'axios';
import { expect } from 'chai';
import jwt from 'jsonwebtoken';

const sendTestRequest = async (data: AddressInput) => {
  const validToken = `Bearer ${jwt.sign({ userId: 'test-user-id' }, process.env.JWT_SECRET, { expiresIn: '1h' })}`;
  return await axios.post('http://localhost:8080/address', data, {
    headers: {
      Authorization: validToken,
    },
    validateStatus: () => true,
  });
};

describe('Address Creation', async () => {
  before(async () => {
    await prisma.user.create({
      data: {
        email: 'test@example.com',
        name: 'Test User',
        password: 'password',
        birthDate: new Date('1990-01-01'),
      },
    });
  });

  it('should create a new address', async () => {
    const user = (await prisma.user.findUnique({
      where: {
        email: 'test@example.com',
      },
    }))!;

    const addressData = {
      userId: user.id,
      zipCode: '12345',
      street: 'Main St',
      streetNumber: '100',
      complement: 'Apt 1',
      neighborhood: 'Downtown',
      city: 'Metropolis',
      state: 'State',
    };

    const response = await sendTestRequest(addressData);

    expect(response.status).to.be.equal(201);
    expect(response.data).to.deep.eq({
      id: response.data.id,
      zipCode: '12345',
      street: 'Main St',
      streetNumber: '100',
      complement: 'Apt 1',
      neighborhood: 'Downtown',
      city: 'Metropolis',
      state: 'State',
    });
  });

  after(async () => {
    await prisma.address.deleteMany();
    await prisma.user.deleteMany();
  });
});

describe('Create Address Errors', () => {
  it('should return user not found error', async () => {
    const addressData = {
      userId: 1, // non-existent user ID
      zipCode: '12345',
      street: 'Main St',
      streetNumber: '100',
      complement: 'Apt 1',
      neighborhood: 'Downtown',
      city: 'Metropolis',
      state: 'State',
    };

    const response = await sendTestRequest(addressData);
    expect(response.status).to.be.equal(404);
    expect(response.data).to.deep.eq({
      code: 'ADR_01',
      message: 'User id not found',
      details: 'No user found with the given ID.',
    });
  });
});
