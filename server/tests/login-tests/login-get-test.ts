import { server } from '../../index';
import request from 'supertest';
import { getTestIdToken } from '../test-helpers';
import { prisma } from '../../prisma/client';
import { mocks } from '../../../mocks';
import { InitialUserDTO } from '../../interfaces/user.interface.dto';

export const loginTests = (): void => {
  describe('/login', () => {
    const mockInitialUserInput: InitialUserDTO = {
      id: process.env.SECRET_UID!,
      email: mocks.Users[0].email,
      emailVerified: mocks.Users[0].emailVerified
    };
    let testToken: string|undefined;
    beforeAll(async () => {
      await prisma.user.create({ data: mockInitialUserInput });
    });
    beforeEach(async () => {
      testToken = await getTestIdToken();
    });

    it('Should attach the users email and id if user is valid', async () => {
      const { body } = await request(server)
        .get('/api/login')
        .set('Authorization', 'Bearer ' + testToken)
        .expect('Content-Type', /json/)
        .expect(200);
      expect(body.data.user).toHaveProperty('email');
      expect(body.data.user).toHaveProperty('id');
    });

    it('Should return the error if user is not valid', async () => {
      const { body } = await request(server)
        .get('/api/login')
        .set('Authorization', 'Bearer ' + testToken + 'X')
        .expect('Content-Type', /json/)
        .expect(401);
      expect(body).toHaveProperty('error');
    });
  });
};
