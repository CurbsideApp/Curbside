import { favoritesDeleteTests } from './favorites-delete-tests';
import { favoritesGetTests } from './favorites-get-tests';
import { favoritesPatchTests } from './favorites-patch-tests';

export const favoritesTests = async (): Promise<void> => {
  describe('/favorites', () => {
    favoritesPatchTests();
    favoritesGetTests();
    favoritesDeleteTests();
  });
};
