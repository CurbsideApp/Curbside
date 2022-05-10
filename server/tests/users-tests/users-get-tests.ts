import request from 'supertest';
import { server } from '../../index';
import { mocks } from '../../../mocks';
import { prisma } from '../../prisma/client';
import { getTestIdToken } from '../test-helpers';
import { IUser } from '../../interfaces/user.interface';
import { USER_NOT_FOUND } from '../../errors/SharedErrorMessages';
export const usersGetTests = (): void => {
  describe('GET /users/:id', () => {
    const mockUserInput: IUser = { ...mocks.Users[0], createdAt: new Date(), id: process.env.SECRET_UID! };
    const mockUserInputForeign: IUser = { ...mocks.Users[0], createdAt: new Date() };

    let testToken: string|undefined;

    beforeEach(async () => {
      testToken = await getTestIdToken();
    });

    afterEach(async () => {
      await prisma.user.deleteMany();
    });

    it('Should get ALL user data and listings if requesting user is target user', async () => {
      expect(await prisma.user.findUnique({ where: { id: mockUserInput.id } })).toBeNull();
      await prisma.user.create({ data: mockUserInput });
      const { body } = await request(server)
        .get(`/users/${mockUserInput.id}`)
        .set('Authorization', 'Bearer ' + testToken)
        .expect('Content-Type', /json/)
        .expect(200);
      expect({ ...body.user, createdAt: new Date(body.user.createdAt) }).toEqual(mockUserInput);
    });

    it('Should get ONLY public user data and listings if requesting user is target user', async () => {
      expect(await prisma.user.findUnique({ where: { id: mockUserInputForeign.id } })).toBeNull();
      await prisma.user.create({ data: mockUserInputForeign });
      const { body } = await request(server)
        .get(`/users/${mockUserInputForeign.id}`)
        .set('Authorization', 'Bearer ' + testToken)
        .expect('Content-Type', /json/)
        .expect(200);
      expect(body.user.id).toEqual(mockUserInputForeign.id);
      expect(body.user.firstName).toEqual(mockUserInputForeign.firstName);
      expect(body.user.lastName).toEqual(mockUserInputForeign.lastName);
      expect(new Date(body.user.createdAt)).toEqual(mockUserInputForeign.createdAt);
      expect(body.user.photoUrl).toEqual(mockUserInputForeign.photoUrl);
      expect(body.user.city).toBeUndefined();
      expect(body.user.longitude).toBeUndefined();
      expect(body.user.latitude).toBeUndefined();
      expect(body.user.emailVerified).toBeUndefined();
      expect(body.user.email).toBeUndefined();
    });

    it('Should send a custom error to the client if something goes wrong', async () => {
      const { body, statusCode } = await request(server)
        .get('/users/NONE')
        .set('Authorization', 'Bearer ' + testToken)
        .expect('Content-Type', /json/);
      expect(statusCode).toBeGreaterThanOrEqual(400);
      expect(body.error).toEqual(USER_NOT_FOUND);
    });

    it('Should send a 200 even if user is not authenticated', async () => {
      await prisma.user.create({ data: mockUserInput });
      await request(server)
        .get(`/users/${mockUserInput.id}`)
        .expect('Content-Type', /json/)
        .expect(200);
    });
  });
};
