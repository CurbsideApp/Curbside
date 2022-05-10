
export enum IListingCondition {
  new = 'new',
  gentlyUsed = 'gentlyUsed',
  used = 'used'
}
export interface IListing {
  id: string,
  userId: string,
  title: string,
  description: string,
  priceInCents: number,
  currency: string,
  condition: IListingCondition,
  photoUrls: string[],
  longitude: number,
  latitude: number,
  status: string,
}
