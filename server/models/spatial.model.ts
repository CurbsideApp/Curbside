import { CustomError } from '../errors/CustomError.class';
import { IListing } from '../interfaces/listing.interface';
import { UNKNOWN_SERVER_ERROR } from '../errors/SharedErrorMessages';
import { spatialQuery, spatialQueryListings } from '../queries/spatialQueries';

export const getListings = async (): Promise<any> => {
  try {
    console.log("i'm BEFORE the query");
    const query: string[] = await spatialQuery(52.5200, 13.405, 0);
    const listings: IListing[] = await spatialQueryListings(query);
    return listings;
  } catch (error) {
    console.log('/models/users.model addInitialUser ERROR', error);
    if (error instanceof CustomError) {
      throw error;
    }
    throw new CustomError(UNKNOWN_SERVER_ERROR, 500);
  }
};

export default {
  getListings
};
