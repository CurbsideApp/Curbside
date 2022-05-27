import request from 'supertest';
import { mocks } from '../../../mocks';
import { InitialUserDTO } from '../../interfaces/user.interface.dto';
import { getTestIdToken } from '../test-helpers';
import { prisma } from '../../prisma/client';
import { server } from '../../index';
import { IListingCondition } from '../../interfaces/listing.interface';
import { AddListingDTO } from '../../interfaces/listing.interface.dto';
import favoriteQueries from '../../queries/favorite.queries';
import { USER_NOT_AUTHENTICATED } from '../../errors/SharedErrorMessages';

export const favoritesDeleteTests = (): void => {
  describe('DELETE /favorites', () => {
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
    let dbUser: any;
    let dbListing: any;

    beforeAll(async () => {
      dbUser = await prisma.user.create({ data: { ...mockInitialUserInput, firstName: 'test', lastName: 'tester' } });
      dbListing = await prisma.listing.create({ data: { ...mockAddListing } });
      await favoriteQueries.addFavorite(dbUser.id, dbListing.id);
    });

    beforeEach(async () => {
      testToken = await getTestIdToken();
    });

    afterEach(async () => {
      await prisma.user.deleteMany();
    });

    it('Should add a new listing to user favorites and return all favorites', async () => {
      const { body } = await request(server)
        .delete('/api/favorites')
        .set('Authorization', 'Bearer ' + testToken)
        .expect('Content-Type', /json/)
        .send({ favoriteId: dbListing.id })
        .expect(200);
      expect(body.data.favorites.length).toEqual(0);
    });

    it('Should return 401 error for invalid user auth', async () => {
      const { body } = await request(server)
        .patch('/api/favorites/')
        .set('Authorization', 'Bearer ' + testToken + 'X')
        .expect('Content-Type', /json/)
        .send({ favoriteId: dbListing.id })
        .expect(401);
      expect(body.error).toBe(USER_NOT_AUTHENTICATED);
    });
  });
};
