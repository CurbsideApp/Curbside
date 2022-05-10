import request from 'supertest';
import { server } from '../../index';
import { mocks } from '../../../mocks';
import { AddListingDTO } from '../../interfaces/listings.interface.dto';
import { prisma } from '../../prisma/client';
import { getTestIdToken } from '../test-helpers';
import { InitialUserDTO } from '../../interfaces/users.interface.dto';
import { IListingCondition } from '../../interfaces/listing.interface';
import { listingsModelErrorMessages } from '../../models/listings.model.validation';
export const listingsPostTests = (): void => {
  describe('POST /listings', () => {
    const mockInitialUserInput: InitialUserDTO = {
      id: mocks.Users[0].id,
      email: mocks.Users[0].email,
      emailVerified: mocks.Users[0].emailVerified
    };

    const mockAddListing: AddListingDTO = {
      userId: mocks.listings[0].userId,
      title: mocks.listings[0].title,
      description: mocks.listings[0].description,
      priceInCents: mocks.listings[0].price,
      currency: 'eur',
      condition: IListingCondition.new,
      photoUrls: JSON.stringify(mocks.listings[0].images),
      longitude: mocks.listings[0].longitude,
      latitude: mocks.listings[0].latitude
    };

    let testToken: string|undefined;

    beforeAll(async () => {
      await prisma.user.create({ data: mockInitialUserInput });
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
      const intialListings = await prisma.listing.findMany();
      expect(intialListings.length).toEqual(0);
      const { body } = await request(server)
        .post('/listings')
        .set('Authorization', 'Bearer ' + testToken)
        .expect('Content-Type', /json/)
        .send(mockAddListing)
        .expect(200);
      expect(body.listing.title).toEqual(mockAddListing.title);
      expect(body.listing.description).toEqual(mockAddListing.description);
      expect(body.listing).toHaveProperty('id');
      expect(body.listing).toHaveProperty('createdAt');
      expect(await prisma.listing.findUnique({ where: { id: body.listing.id } })).not.toBeNull();
    });

    it('Should send a custom error to the client if the validation fails', async () => {
      const { body, statusCode } = await request(server)
        .post('/listings')
        .set('Authorization', 'Bearer ' + testToken)
        .expect('Content-Type', /json/)
        .send({ ...mockAddListing, photoUrls: JSON.stringify([]) });
      expect(statusCode).toBeGreaterThanOrEqual(400);
      expect(body).toHaveProperty('error');
      expect(JSON.parse(body.error).photoUrls).toEqual(listingsModelErrorMessages.invalidPhotos);
    });

    it('Should send a custom error to the client if a non valid userId is provided', async () => {
      const { body, statusCode } = await request(server)
        .post('/listings')
        .set('Authorization', 'Bearer ' + testToken)
        .expect('Content-Type', /json/)
        .send({ ...mockAddListing, userId: 'bla' });
      expect(statusCode).toBeGreaterThanOrEqual(400);
      expect(body).toHaveProperty('error');
      expect(JSON.parse(body.error).user).toEqual(listingsModelErrorMessages.userNotFound);
    });

    it('Should send a 401 if user is not authenticated', async () => {
      const { body, statusCode } = await request(server)
        .post('/listings')
        .set('Authorization', 'Bearer ' + testToken + 'X')
        .expect('Content-Type', /json/)
        .send({});
      expect(statusCode).toBe(401);
      expect(body).toHaveProperty('error');
    });
  });
};
