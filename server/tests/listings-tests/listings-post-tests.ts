import request from 'supertest';
import { server } from '../../index';
import { mocks } from '../../../mocks';
import { AddListingDTO } from '../../interfaces/listing.interface.dto';
import { prisma } from '../../prisma/client';
import { getTestIdToken } from '../test-helpers';
import { InitialUserDTO } from '../../interfaces/user.interface.dto';
import { IListingCondition } from '../../interfaces/listing.interface';
import { listingsModelErrorMessages } from '../../models/model-helpers/listing.model.validation';

export const listingsPostTests = (): void => {
  describe('POST /listings', () => {
    const mockInitialUserInput: InitialUserDTO = {
      id: process.env.SECRET_UID!,
      email: mocks.Users[0].email,
      emailVerified: mocks.Users[0].emailVerified
    };

    const mockAddListing: AddListingDTO = {
      userId: process.env.SECRET_UID!,
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

    let testToken: string|undefined;

    beforeAll(async () => {
      await prisma.user.create({ data: { ...mockInitialUserInput, firstName: 'test', lastName: 'tester' } });
    });

    beforeEach(async () => {
      testToken = await getTestIdToken();
    });

    afterEach(async () => {
      await prisma.listing.deleteMany();
    });
    afterAll(async () => {
      await prisma.user.deleteMany();
    });

    it('Should add listing to the database and return it with id and createdAt fields added', async () => {
      const initialListings = await prisma.listing.findMany();
      expect(initialListings.length).toEqual(0);
      const { body } = await request(server)
        .post('/api/listings')
        .set('Authorization', 'Bearer ' + testToken)
        .expect('Content-Type', /json/)
        .send(mockAddListing)
        .expect(200);
      expect(body.data.listing.title).toEqual(mockAddListing.title);
      expect(body.data.listing.description).toEqual(mockAddListing.description);
      expect(body.data.listing).toHaveProperty('id');
      expect(body.data.listing).toHaveProperty('createdAt');
      expect(await prisma.listing.findUnique({ where: { id: body.data.listing.id } })).not.toBeNull();
    });

    it('Should send a custom error to the client if the validation fails', async () => {
      const { body, statusCode } = await request(server)
        .post('/api/listings')
        .set('Authorization', 'Bearer ' + testToken)
        .expect('Content-Type', /json/)
        .send({ ...mockAddListing, photoUrls: [] });
      expect(statusCode).toBeGreaterThanOrEqual(400);
      expect(body).toHaveProperty('error');
      expect(JSON.parse(body.error).photoUrls).toEqual(listingsModelErrorMessages.invalidPhotos);
    });

    it('Should send a custom error to the client if a non valid userId is provided', async () => {
      const { body, statusCode } = await request(server)
        .post('/api/listings')
        .set('Authorization', 'Bearer ' + testToken)
        .expect('Content-Type', /json/)
        .send({ ...mockAddListing, userId: 'bla' });
      expect(statusCode).toBeGreaterThanOrEqual(400);
      expect(body).toHaveProperty('error');
      expect(JSON.parse(body.error).user).toEqual(listingsModelErrorMessages.userNotFound);
    });

    it('Should send a 401 if user is not authenticated', async () => {
      const { body, statusCode } = await request(server)
        .post('/api/listings')
        .set('Authorization', 'Bearer ' + testToken + 'X')
        .expect('Content-Type', /json/)
        .send({});
      expect(statusCode).toBe(401);
      expect(body).toHaveProperty('error');
    });
  });
};
