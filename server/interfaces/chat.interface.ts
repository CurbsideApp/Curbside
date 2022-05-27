import { IListingStatus } from './listing.interface';
import { IMessage } from './message.interface';

export interface IChat {
  id: string,
  sellerId: string,
  sellerFirstName: string,
  sellerLastName: string,
  buyerId: string,
  buyerName: string,
  buyerPhotoUrl?: string,
  listingId: string,
  listingTitle: string,
  listingPhotoUrls?: string[],
  listingStatus: IListingStatus,
  priceInCents: number,
  currency: string,
  lastMessage: IMessage,
  createdAt: Date,
  updatedAt: Date
}
