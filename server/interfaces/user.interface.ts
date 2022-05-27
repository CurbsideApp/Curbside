export interface IUser {
  id: string,
  firstName?: string,
  lastName?: string,
  email: string,
  emailVerified: boolean,
  photoUrl?: string,
  createdAt: Date,
  city?: string,
  longitude?: number,
  latitude?: number,
  favorites?:string[]
}

export interface IStrippedUser {
  id: string,
  firstName: string,
  lastName: string,
  photoUrl?: string,
  createdAt: Date,
}

export interface IUserInfoSelect{
  userFirstName: string,
  userLastName: string,
  userPhotoUrl: string | null
}
