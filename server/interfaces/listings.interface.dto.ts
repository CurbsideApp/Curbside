import { IListingCondition } from './listing.interface';

export interface AddListingDTO {
  userId: string,
  title: string,
  description: string,
  priceInCents: number,
  currency: string,
  condition: IListingCondition,
  photoUrls: string, // JSON array
  longitude: number,
  latitude: number,
}
