export interface ITransaction {
  id: string,
  listingId: string,
  sellerId: string,
  buyerId?: string,
  createdAt: Date
  ratingGiven?: boolean
}

export interface ITransactionDTO {
  id? :string,
  listingId: string,
  sellerId: string,
  buyerId?: string,
}
