import { server } from '..';
import { prisma } from '../prisma/client';
import { chatsTests } from './chats-tests/chats-tests';
import { favoritesTests } from './favorites-tests/favorites-tests';
import { listingsTests } from './listings-tests/listings-test';
import { ratingTests } from './rating-tests/rating-post-tests';
import { usersTests } from './users-tests/users-test';

describe('Backend Server End-To-End Tests', () => {
  beforeAll(async () => {
    await prisma.listing.deleteMany();
    await prisma.rating.deleteMany();
    await prisma.chat.deleteMany();
    await prisma.user.deleteMany();
  });

  usersTests();
  listingsTests();
  chatsTests();
  ratingTests();
  favoritesTests();
  afterAll(async () => {
    server.close();
  });
});
