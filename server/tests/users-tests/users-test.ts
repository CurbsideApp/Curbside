import { usersGetTests } from './users-get-tests';
import { usersPatchTests } from './users-patch-tests';
import { usersPostTests } from './users-post-tests';

export const usersTests = async (): Promise<void> => {
  describe('/users', () => {
    usersPostTests();
    usersPatchTests();
    usersGetTests();
  });
};
