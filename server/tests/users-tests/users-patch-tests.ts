import request from 'supertest';
import { server } from '../../index';
import { mocks } from '../../../mocks';
import { FinalizeUserDTO } from '../../interfaces/user.interface.dto';
import { prisma } from '../../prisma/client';
import { getTestIdToken } from '../test-helpers';

export const usersPatchTests = (): void => {
  describe('PATCH /users/:id', () => {
    const mockFinalizeUserInput: FinalizeUserDTO = {
      firstName: mocks.Users[0].firstName,
      lastName: mocks.Users[0].lastName,
      city: mocks.Users[0].city,
      latitude: mocks.Users[0].latitude,
      longitude: mocks.Users[0].longitude,
      emailVerified: mocks.Users[0].emailVerified
    };

    let testToken: string|undefined;

    beforeEach(async () => {
      testToken = await getTestIdToken();
    });

    afterEach(async () => {
      await prisma.user.deleteMany();
    });

    it('Should update a user entry and send the user with the updated fields back', async () => {
      await prisma.user.create({
        data: {
          id: process.env.SECRET_UID!,
          email: mocks.Users[0].email,
          emailVerified: mocks.Users[0].emailVerified
        }
      });
      const { body } = await request(server)
        .patch(`/api/users/${process.env.SECRET_UID}`)
        .set('Authorization', 'Bearer ' + testToken)
        .expect('Content-Type', /json/)
        .send(mockFinalizeUserInput)
        .expect(200);
      expect(body.data.user.emailVerified).toEqual(mockFinalizeUserInput.emailVerified);
      expect(body.data.user).toHaveProperty('id');
      expect(body.data.user).toHaveProperty('email');
      expect(body.data.user).toHaveProperty('createdAt');
    });

    it('Should send a custom error to the client if something goes wrong', async () => {
      const { body, statusCode } = await request(server)
        .patch(`/api/users/${process.env.SECRET_UID}`)
        .set('Authorization', 'Bearer ' + testToken)
        .expect('Content-Type', /json/)
        .send({});
      expect(statusCode).toBeGreaterThanOrEqual(400);
      expect(body).toHaveProperty('error');
    });

    it('Should send a 401 if user is not authenticated', async () => {
      const { body, statusCode } = await request(server)
        .patch(`/api/users/${process.env.SECRET_UID}`)
        .set('Authorization', 'Bearer ' + testToken + 'X')
        .expect('Content-Type', /json/)
        .send({});
      expect(statusCode).toBe(401);
      expect(body).toHaveProperty('error');
    });
  });
};
