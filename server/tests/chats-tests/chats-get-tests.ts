import request from 'supertest';
import { server } from '../..';
import { IListingCondition } from '../../interfaces/listing.interface';
import { AddListingDTO } from '../../interfaces/listing.interface.dto';
import { InitialUserDTO } from '../../interfaces/user.interface.dto';
import { prisma } from '../../prisma/client';
import { getTestIdToken } from '../test-helpers';

export const getChatsByUserIdTests = (): void => {
  describe('GET /chats', () => {
    let buyer: any, seller: any, listing: any;
    let testToken: string|undefined;
    let mockAddChat: any;
    beforeAll(async () => {
      const mockUser1: InitialUserDTO = {
        id: process.env.SECRET_UID!,
        email: 'mockuser@test.com',
        emailVerified: true
      };
      const mockUser2: InitialUserDTO = {
        id: process.env.SECRET_UID2!,
        email: 'mockuser2@test.com',
        emailVerified: true
      };
      const mockListing: AddListingDTO = {
        userId: process.env.SECRET_UID2!,
        condition: IListingCondition.new,
        currency: 'eur',
        description: 'Mock description',
        latitude: 52.52,
        longitude: 13.405,
        photoUrls: JSON.stringify(['https://secure.img1-ag.wfcdn.com/im/54089193/resize-h600-w600%5Ecompr-r85/1231/123110031/Daulton+20%27%27+Wide+Velvet+Side+Chair.jpg']),
        priceInCents: 9090,
        title: 'Mock Chat Listing',
        tags: 'bike car'
      };

      buyer = await prisma.user.create({ data: { ...mockUser1, firstName: 'Test', lastName: 'Tester' } });
      seller = await prisma.user.create({ data: { ...mockUser2, firstName: 'Test', lastName: 'Tester' } });
      listing = await prisma.listing.create({ data: mockListing });

      testToken = await getTestIdToken();

      mockAddChat = { buyerId: buyer.id, sellerId: seller.id, listingId: listing.id };
    });

    beforeEach(async () => {
      const chat = await prisma.chat.create({ data: mockAddChat });
      await prisma.message.create({ data: { body: 'Test Message', senderId: buyer.id, chatId: chat.id } });
    });

    afterEach(async () => {
      await prisma.message.deleteMany();
      await prisma.chat.deleteMany();
    });

    it('Should get all chats where a user is either a buyer', async () => {
      const { body } = await request(server)
        .get('/api/chats')
        .set('Authorization', 'Bearer ' + testToken)
        .expect('Content-Type', /json/)
        .expect(200);
      const chats = body.data;
      expect(chats.length).toBe(1);
    });
  });
};
