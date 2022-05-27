export interface AddRatingDTO{
  rating: number,
  buyerId: string,
  sellerId: string
}

export interface IRating{
  id:string,
  rating: number,
  buyerId: string,
  sellerId: string
}
