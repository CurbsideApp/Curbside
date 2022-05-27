import request from 'supertest';
import { server } from '../..';
import { mocks } from '../../../mocks';
import { IListingCondition, IListingStatus } from '../../interfaces/listing.interface';
import { AddListingDTO, FinalizeListingDTO } from '../../interfaces/listing.interface.dto';
import { InitialUserDTO } from '../../interfaces/user.interface.dto';
import { prisma } from '../../prisma/client';
import { getTestIdToken } from '../test-helpers';

export const listingsPatchTests = (): void => {
  describe('PATCH /listings/:id', () => {
    const mockInitialUserInput1: InitialUserDTO = {
      id: process.env.SECRET_UID!,
      email: mocks.Users[0].email,
      emailVerified: mocks.Users[0].emailVerified,
      photoUrl: mocks.Users[0].photoUrl
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

    const mockFinalizeListingInput: FinalizeListingDTO = {
      title: 'updated title',
      description: 'updated description',
      priceInCents: 99999,
      condition: IListingCondition.used,
      photoUrls: JSON.stringify(mocks.listings[0].images),
      longitude: mocks.listings[0].longitude,
      latitude: mocks.listings[0].latitude,
      status: IListingStatus.reserved
    };

    let listingFromDb: any;
    let testToken: string|undefined;

    beforeAll(async () => {
      await prisma.user.deleteMany();
      await prisma.user.create({ data: { ...mockInitialUserInput1, firstName: 'Test', lastName: 'Tester' } });
      listingFromDb = await prisma.listing.create({ data: mockAddListing });
    });

    beforeEach(async () => {
      testToken = await getTestIdToken();
    });

    afterEach(async () => {
      await prisma.user.deleteMany();
    });

    afterAll(async () => {
      await prisma.$disconnect();
      server.close();
    });

    it('Should make corresponding updates to selected listing, and return the updated listing', async () => {
      const { body } = await request(server)
        .patch(`/api/listings/${listingFromDb.id}`)
        .set('Authorization', 'Bearer ' + testToken)
        .expect('Content-Type', /json/)
        .send(mockFinalizeListingInput)
        .expect(200);
      expect(body.data.listing.title).toEqual('updated title');
      expect(body.data.listing.description).toEqual('updated description');
      expect(body.data.listing.priceInCents).toEqual(99999);
      expect(body.data.listing.condition).toEqual(IListingCondition.used);
      expect(body.data.listing.status).toEqual(IListingStatus.reserved);
    });

    it('Should send a custom error to the client if something goes wrong', async () => {
      const { body } = await request(server)
        .patch(`/api/listings/${listingFromDb.id}`)
        .set('Authorization', 'Bearer ' + testToken)
        .expect('Content-Type', /json/)
        .send({})
        .expect(400);
      expect(body).toHaveProperty('error');
    });

    it('Should 401 error if user is NOT authorized', async () => {
      const { body } = await request(server)
        .patch(`/api/listings/${listingFromDb.id}`)
        .set('Authorization', 'Bearer ' + testToken + 'X')
        .expect('Content-Type', /json/)
        .send(mockFinalizeListingInput)
        .expect(401);
      expect(body).toHaveProperty('error');
    });
  });
};
