import request from 'supertest';
import { server } from '../../index';
import { mocks } from '../../../mocks';
import { prisma } from '../../prisma/client';
import { getTestIdToken } from '../test-helpers';
import { IUser } from '../../interfaces/user.interface';
import { USER_NOT_FOUND } from '../../errors/SharedErrorMessages';
import { AddListingDTO } from '../../interfaces/listing.interface.dto';
import { IListingCondition } from '../../interfaces/listing.interface';

export const usersGetTests = (): void => {
  describe('GET /users/:id', () => {
    const mockUserInput: IUser = { ...mocks.Users[0], createdAt: new Date(), id: process.env.SECRET_UID! };
    const mockUserInputForeign: IUser = { ...mocks.Users[0], createdAt: new Date() };

    let testToken: string|undefined;

    beforeEach(async () => {
      testToken = await getTestIdToken();
    });

    afterEach(async () => {
      await prisma.listing.deleteMany();
      await prisma.user.deleteMany();
    });

    it('Should get ALL user data and listings if requesting user is target user', async () => {
      expect(await prisma.user.findUnique({ where: { id: mockUserInput.id } })).toBeNull();
      await prisma.user.create({ data: mockUserInput });
      const { body } = await request(server)
        .get(`/api/users/${mockUserInput.id}`)
        .set('Authorization', 'Bearer ' + testToken)
        .expect('Content-Type', /json/)
        .expect(200);
      expect({ ...body.data.user, createdAt: new Date(body.data.user.createdAt) }).toEqual(mockUserInput);
    });

    it('Should get ONLY public user data and listings if requesting user is target user', async () => {
      expect(await prisma.user.findUnique({ where: { id: mockUserInputForeign.id } })).toBeNull();
      const mockAddListing: AddListingDTO = {
        userId: mockUserInputForeign.id,
        title: mocks.listings[0].title,
        description: mocks.listings[0].description,
        priceInCents: mocks.listings[0].price,
        currency: 'eur',
        condition: IListingCondition.new,
        photoUrls: JSON.stringify(mocks.listings[0].images),
        longitude: mocks.listings[0].longitude,
        latitude: mocks.listings[0].latitude,
        tags: 'car bike'
      };
      await prisma.user.create({ data: mockUserInputForeign });
      await prisma.listing.create({ data: mockAddListing });
      const { body } = await request(server)
        .get(`/api/users/${mockUserInputForeign.id}`)
        .set('Authorization', 'Bearer ' + testToken)
        .expect('Content-Type', /json/)
        .expect(200);
      expect(body.data.user.id).toEqual(mockUserInputForeign.id);
      expect(body.data.user.firstName).toEqual(mockUserInputForeign.firstName);
      expect(body.data.user.lastName).toEqual(mockUserInputForeign.lastName);
      expect(new Date(body.data.user.createdAt)).toEqual(mockUserInputForeign.createdAt);
      expect(body.data.user.photoUrl).toEqual(mockUserInputForeign.photoUrl);
      expect(body.data.user.city).toBeUndefined();
      expect(body.data.user.longitude).toBeUndefined();
      expect(body.data.user.latitude).toBeUndefined();
      expect(body.data.user.emailVerified).toBeUndefined();
      expect(body.data.user.email).toBeUndefined();
      expect(body.data.listings.length).toEqual(1);
    });

    it('Should send a custom error to the client if something goes wrong', async () => {
      const { body, statusCode } = await request(server)
        .get('/api/users/NONE')
        .set('Authorization', 'Bearer ' + testToken)
        .expect('Content-Type', /json/);
      expect(statusCode).toBeGreaterThanOrEqual(400);
      expect(body.error).toEqual(USER_NOT_FOUND);
    });

    it('Should send a 200 even if user is not authenticated', async () => {
      await prisma.user.create({ data: mockUserInput });
      await request(server)
        .get(`/api/users/${mockUserInput.id}`)
        .expect('Content-Type', /json/)
        .expect(200);
    });
  });
};
