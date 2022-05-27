import request from 'supertest';
import { server } from '../../index';
import { mocks } from '../../../mocks';
import { InitialUserDTO } from '../../interfaces/user.interface.dto';
import { prisma } from '../../prisma/client';
import { getTestIdToken } from '../test-helpers';

export const usersPostTests = (): void => {
  describe('POST /users', () => {
    const mockInitialUserInput: InitialUserDTO = {
      id: mocks.Users[0].id,
      email: mocks.Users[0].email,
      emailVerified: mocks.Users[0].emailVerified
    };

    let testToken: string|undefined;

    beforeEach(async () => {
      testToken = await getTestIdToken();
    });

    afterEach(async () => {
      await prisma.user.deleteMany();
    });

    it('Should add user to the database and return it with createdAt field added', async () => {
      expect(await prisma.user.findUnique({ where: { id: mockInitialUserInput.id } })).toBeNull();
      const { body } = await request(server)
        .post('/api/users')
        .set('Authorization', 'Bearer ' + testToken)
        .expect('Content-Type', /json/)
        .send(mockInitialUserInput)
        .expect(200);
      expect(body.data.user.id).toEqual(mockInitialUserInput.id);
      expect(body.data.user.email).toEqual(mockInitialUserInput.email);
      expect(body.data.user.emailVerified).toEqual(mockInitialUserInput.emailVerified);
      expect(body.data.user).toHaveProperty('createdAt');
      expect(await prisma.user.findUnique({ where: { id: mockInitialUserInput.id } })).not.toBeNull();
    });

    it('Should send a custom error to the client if something goes wrong', async () => {
      const { body, statusCode } = await request(server)
        .post('/api/users')
        .set('Authorization', 'Bearer ' + testToken)
        .expect('Content-Type', /json/)
        .send({});
      expect(statusCode).toBeGreaterThanOrEqual(400);
      expect(body).toHaveProperty('error');
    });

    it('Should send a 401 if user is not authenticated', async () => {
      const { body, statusCode } = await request(server)
        .post('/api/users')
        .set('Authorization', 'Bearer ' + testToken + 'X')
        .expect('Content-Type', /json/)
        .send({});
      expect(statusCode).toBe(401);
      expect(body).toHaveProperty('error');
    });
  });
};
