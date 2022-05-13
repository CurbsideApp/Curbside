import request from 'supertest';
import { mocks } from '../../../mocks';
import { server } from '../../index';
import { AddRatingDTO } from '../../interfaces/rating.interface.dto';
import { InitialUserDTO } from '../../interfaces/users.interface.dto';
import { prisma } from '../../prisma/client';
import { getTestIdToken } from '../test-helpers';

export const ratingTests = ():void => {
  describe.only('POST /Ratings', () => {
    const mockInitialUserInput: InitialUserDTO = {
      id: process.env.SECRET_UID!,
      email: mocks.Users[0].email,
      emailVerified: mocks.Users[0].emailVerified
    };

    const mockInitialUserInput2: InitialUserDTO = {
      id: mocks.Users[1].id,
      email: mocks.Users[1].email,
      emailVerified: mocks.Users[1].emailVerified,
      photoUrl: mocks.Users[1].photoUrl
    };

    const mockAddRating: AddRatingDTO = {
      rating: 1,
      buyerId: mocks.Users[1].id,
      sellerId: process.env.SECRET_UID!
    };

    let testToken: string|undefined;

    beforeAll(async () => {
      await prisma.user.create({ data: mockInitialUserInput });
      await prisma.user.create({ data: mockInitialUserInput2 });
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

    it('Should add new rating to db and return the entry', async () => {
      const { body } = await request(server)
        .post('/ratings')
        .set('Authorization', 'Bearer ' + testToken)
        .expect('Content-Type', /json/)
        .send(mockAddRating)
        .expect(200);
      expect(body.data.rating.sellerId).toEqual(process.env.SECRET_UID);
      expect(body.data.rating.buyerId).toEqual(mocks.Users[1].id);
      expect(body.data.rating.rating).toEqual(1);
      expect(typeof body.data.rating.id).toEqual('string');
    });
    it('Should send a 401 error is user is not authenticated', async () => {
      const { body, statusCode } = await request(server)
        .post('/ratings')
        .set('Authorization', 'Bearer ' + testToken + 'X')
        .expect('Content-Type', /json/)
        .send(mockAddRating);
      expect(statusCode).toBeGreaterThanOrEqual(401);
      expect(body).toHaveProperty('error');
    });

    it('Should throw 404 error is associated users are not in db', async () => {
      await prisma.user.deleteMany();
      const { body } = await request(server)
        .post('/ratings')
        .set('Authorization', 'Bearer ' + testToken)
        .expect('Content-Type', /json/)
        .send(mockAddRating)
        .expect(404);
      console.log('body', body);
      expect(body).toHaveProperty('error');
    });
  });
};