import { CustomError } from '../errors/CustomError.class';
import { LISTING_NOT_FOUND, UNKNOWN_SERVER_ERROR } from '../errors/SharedErrorMessages';
import { IListing, IListingPackage } from '../interfaces/listing.interface';
import { AddListingDTO, FinalizeListingDTO, GetListingQueryParams } from '../interfaces/listing.interface.dto';
import { IUserInfoSelect } from '../interfaces/user.interface';
import listingQueries from '../queries/listing.queries';
import ratingQueries from '../queries/rating.queries';
import userQueries from '../queries/user.queries';
import { addListingInputValidation } from './model-helpers/listing.model.validation';
import distanceHelpers from './model-helpers/distance.helpers';
import { addTransaction } from '../queries/transaction.queries';

const addListing = async (listingDetails: AddListingDTO): Promise<IListing> => {
  try {
    await addListingInputValidation(listingDetails);
    const listing: IListing = await listingQueries.createListing(listingDetails);
    return listing;
  } catch (error) {
    console.log('/models/listings.model addListing ERROR', error);
    if (error instanceof CustomError) {
      throw error;
    }
    throw new CustomError(UNKNOWN_SERVER_ERROR, 500);
  }
};

const getListings = async (userId: string | undefined, params: GetListingQueryParams): Promise<any> => {
  try {
    let long:number|undefined, lat:number|undefined;
    // if coords are passed in then use those values for the query
    if (params.longitude !== undefined && params.latitude !== undefined) {
      long = +params.longitude;
      lat = +params.latitude;
    } else {
      // if long lat are not given
      //    => grab them from the logged in user
      if (userId !== undefined) {
        const user = await userQueries.getUserById(userId);

        if (user && user.longitude && user.latitude) {
          long = user.longitude;
          lat = user.latitude;
        }
      }
      if (long === undefined || lat === undefined) {
        // if no user is logged in
        //    => grab it from the ip
        // if not possible
        //    => add default berlin coordinates
        long = 13.405;
        lat = 52.52;
      }
    }
    const listingsInRangeIds: {id: string}[] = await listingQueries.getIdsInRadius(long, lat, +params.radius);
    let listings: IListing[] = await listingQueries.getListingsInRadius(listingsInRangeIds, params);

    for (const listing of listings) {
      const rating = await ratingQueries.getUserRating(listing.userId);
      // @ts-ignore
      listing.rating = rating;
    }
    // sort by closest
    if (params.sortBy === 'closest') {
      const sortedByDistanceListings = [...listings]
        .sort((a, b) =>
          distanceHelpers.getDistance([a.longitude, a.latitude], [long!, lat!]) -
          distanceHelpers.getDistance([b.longitude, b.latitude], [long!, lat!])
        );
      listings = sortedByDistanceListings;
    }
    //  skip offset
    return listings.slice(+params.offset);
  } catch (error) {
    console.log('/models/users.model getListings ERROR', error);
    if (error instanceof CustomError) {
      throw error;
    }
    throw new CustomError(UNKNOWN_SERVER_ERROR, 500);
  }
};
export const getListingByListingIdModel = async (id:string) : Promise<IListingPackage | null> => {
  try {
    const listing: IListing | null = await listingQueries.getListings(id);
    if (listing === null || undefined) { throw new CustomError(LISTING_NOT_FOUND, 404); }
    const userInfo: IUserInfoSelect | null = await userQueries.getSelectUserInfo(listing.userId);
    const rating: number | null = await ratingQueries.getUserRating(listing.userId);
    const listingPackage: IListingPackage = { ...listing, ...userInfo, rating };
    console.log('listingPackage', listingPackage);
    return listingPackage;
  } catch (error) {
    console.log('/models/listingsById.model getListingByIdModel ERROR', error);
    throw error;
  }
};

export const updateListing = async (listingId: string, listingDetails: FinalizeListingDTO): Promise<IListing> => {
  try {
    const currListing = await listingQueries.getListingById(listingId);
    if (listingDetails.status && listingDetails.status !== currListing.status) {
      // add transaction
      if (currListing.status === 'sold') {
        console.log('UPDATE LISTING');
      } else {
        // check if transaction with listing id already exists
        // if yes => update listing with new buyerid

        // if not => add new transaction
        const transaction = await addTransaction({ listingId, buyerId: listingDetails.buyerId, sellerId: currListing.userId });
        console.log('transaction: ', transaction);
      }
    }
    delete listingDetails.buyerId;
    const listing: IListing = await listingQueries.updateListing(listingId, listingDetails);
    return listing;
  } catch (error) {
    console.log('/models/listingsById.model updateListing ERROR', error);
    throw error;
  }
};

export default {
  addListing,
  getListings,
  getListingByListingIdModel,
  updateListing
};
