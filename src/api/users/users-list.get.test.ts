import { after, before, describe, it } from 'node:test';
import { prisma } from '@core/db/db.js';
import axios from 'axios';
import { expect } from 'chai';
import jwt from 'jsonwebtoken';

const sendTestRequest = async (limit: number, page: number, token?: string) => {
  const validToken = `Bearer ${jwt.sign({ userId: 'test-user-id' }, process.env.JWT_SECRET, { expiresIn: '1h' })}`;
  return axios.get('http://localhost:8080/users', {
    params: {
      limit,
      page,
    },
    validateStatus: () => true,
    headers: {
      Authorization: token === undefined ? validToken : token,
    },
  });
};

describe('Get User List', () => {
  before(async () => {
    for (let i = 0; i < 10; i++) {
      await prisma.user.create({
        //TODO: Use seed function once rebase is done
        data: {
          name: `User ${i}`,
          email: `user${i}@example.com`,
          birthDate: new Date(2000, 0, 1),
          password: 'password',
        },
      });
    }
  });

  it('should return a list of users', async () => {
    const response = await sendTestRequest(5, 1);
    expect(response.data.users).to.have.lengthOf(5);
    expect(response.status).to.equal(200);
    const userList = await prisma.user.findMany({
      skip: 0,
      take: 5,
      orderBy: { name: 'asc' },
      omit: {
        password: true,
      },
    });

    const formattedUserList = userList.map(user => ({
      ...user,
      birthDate: user.birthDate.toISOString(),
    }));

    expect(response.data.users).to.deep.equal(formattedUserList);
    const userCount = await prisma.user.count();
    const paginationData = {
      totalItems: userCount,
      totalPages: Math.ceil(userCount / 5),
    };
    expect(response.data.pagination).to.deep.equal(paginationData);
  });

  after(async () => {
    await prisma.user.deleteMany();
  });
});
