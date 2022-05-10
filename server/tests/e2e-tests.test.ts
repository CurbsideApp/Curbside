import { server } from '..';
import { prisma } from '../prisma/client';
import { listingsTests } from './listsings-tests/listings-test';
import { usersTests } from './users-tests/users-test';

describe('Backend Server End-To-End Tests', () => {
  beforeAll(async () => {
    await prisma.user.deleteMany();
  });

  usersTests();
  listingsTests();

  afterAll(async () => {
    await prisma.$disconnect();
    server.close();
  });
});
