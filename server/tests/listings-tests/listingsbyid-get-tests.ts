import { server, app } from '../../index';
import request from 'supertest';
import { prisma } from '../../prisma/client';
import { InitialUserDTO } from '../../interfaces/user.interface.dto';
import { mocks } from '../../../mocks';
import { AddListingDTO } from '../../interfaces/listing.interface.dto';
import { IListingCondition } from '../../interfaces/listing.interface';
import { LISTING_NOT_FOUND } from '../../errors/SharedErrorMessages';
import { AddRatingDTO } from '../../interfaces/rating.interface.dto';

export const getListingsByIdTests = (): void => {
  describe('GET /listings/:id', () => {
    const mockInitialUserInput1: InitialUserDTO = {
      id: mocks.Users[0].id,
      email: mocks.Users[0].email,
      emailVerified: mocks.Users[0].emailVerified,
      photoUrl: mocks.Users[0].photoUrl
    };
    const mockInitialUserInput2: InitialUserDTO = {
      id: mocks.Users[1].id,
      email: mocks.Users[1].email,
      emailVerified: mocks.Users[1].emailVerified,
      photoUrl: mocks.Users[1].photoUrl

    };
    const mockInitialUserInput3: InitialUserDTO = {
      id: mocks.Users[2].id,
      email: mocks.Users[2].email,
      emailVerified: mocks.Users[2].emailVerified,
      photoUrl: mocks.Users[2].photoUrl

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
      latitude: mocks.listings[0].latitude,
      tags: 'car bike'
    };

    const mockAddRating1: AddRatingDTO = {
      sellerId: mocks.Users[0].id,
      buyerId: mocks.Users[1].id,
      rating: 3
    };
    const mockAddRating2: AddRatingDTO = {
      sellerId: mocks.Users[0].id,
      buyerId: mocks.Users[2].id,
      rating: 5
    };

    let listingFromDb: any;

    beforeAll(async () => {
      await prisma.user.create({ data: mockInitialUserInput1 });
      await prisma.user.create({ data: mockInitialUserInput2 });
      await prisma.user.create({ data: mockInitialUserInput3 });
      listingFromDb = await prisma.listing.create({ data: mockAddListing });
      await prisma.rating.create({ data: mockAddRating1 });
      await prisma.rating.create({ data: mockAddRating2 });
    });

    afterAll(async () => {
      await prisma.$disconnect();
      server.close();
    });

    it('Should find listing and return it with the userPhoto and rating', async () => {
      const id = listingFromDb.id;
      const { body, statusCode } = await request(app)
        .get(`/api/listings/${id}`);

      expect(statusCode).toEqual(200);
      expect(body.data.listing.id).toEqual(id);
      expect(body.data.listing.rating).toEqual(4);
      expect(body.data.listing.userPhotoUrl).toEqual(mockInitialUserInput1.photoUrl);
      expect(body.data.listing.userId).toEqual(listingFromDb.userId);
      expect(body.data.listing.title).toEqual(listingFromDb.title);
      expect(body.data.listing.description).toEqual(listingFromDb.description);
      expect(body.data.listing.priceInCents).toEqual(listingFromDb.priceInCents);
      expect(body.data.listing.condition).toEqual(listingFromDb.condition);
      expect(body.data.listing.photoUrls).toEqual(listingFromDb.photoUrls);
      expect(body.data.listing.longitude).toEqual(listingFromDb.longitude);
      expect(body.data.listing.latitude).toEqual(listingFromDb.latitude);
      expect(body.data.listing.status).toEqual('available');
      expect(body.data.listing.createdAt).toEqual(listingFromDb.createdAt.toISOString());
    });
    it('Should send 404 if listing can\'t be found', async () => {
      const { body, statusCode } = await request(app)
        .get('/api/listings/NONE');
      expect(statusCode).toEqual(404);
      expect(body.error).toEqual(LISTING_NOT_FOUND);
    });
  });
};
