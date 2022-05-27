import { IListing } from './listing.interface';

export interface IUserFavoritesPackage {
  user: string,
  favorites: IListing[]
}
