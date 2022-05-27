import { listingsGetTests } from './listings-get-tests';
import { listingsPatchTests } from './listings-patch-tests';
import { listingsPostTests } from './listings-post-tests';
import { getListingsByIdTests } from './listingsbyid-get-tests';

export const listingsTests = async (): Promise<void> => {
  describe('/listings', () => {
    listingsPostTests();
    listingsGetTests();
    getListingsByIdTests();
    listingsPatchTests();
  });
};
