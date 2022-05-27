import { IListingCondition, IListingStatus } from './listing.interface';

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
  tags: string
}

export interface FinalizeListingDTO {
  title: string,
  description: string,
  priceInCents: number,
  condition: IListingCondition,
  photoUrls: string, // JSON array
  longitude: number,
  latitude: number,
  status: IListingStatus
  buyerId?: string,
}

export interface GetListingQueryParams {
  offset: string,
  radius: string,
  tags?: string,
  maxPrice?: string,
  minPrice: string,
  sortBy: string,
  condition: string,
  longitude?:string,
  latitude?:string,
  search?:string,
}

export interface IdbSelectUserDetails{
  firstName: string| null,
  lastName: string| null,
  photoUrl: string | null
}
