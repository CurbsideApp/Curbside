import { IListing } from './listing.interface';
import { IStrippedUser, IUser } from './user.interface';

export interface ProfileDTO {
  user: IStrippedUser | IUser,
  listings: IListing[],
}
