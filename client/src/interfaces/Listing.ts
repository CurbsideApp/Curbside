export interface Listing {
  condition: string,
  createdAt: Date,
  currency: string,
  description: string,
  id: string,
  latitude: number,
  longitude: number,
  photoUrls: string[],
  priceInCents: number,
  rating?: number,
  status: string,
  title: string,
  userFirstName: string,
  userId: string,
  userLastName: string,
  userPhotoUrl: string,
}

export interface listingChatPreview {
  id: string,
  title: string, 
  buyerId?: string, 
  sellerId: string, 
  userFirstName:string,
  userLastName:string,
  photoUrls: string[],
  status: string,
  priceInCents: number
}