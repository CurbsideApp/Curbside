export interface User {
  id: string,
  email: string,
  firstName: string,
  lastName: string,
  emailVerified: boolean,
  photoUrl: string,
  createdAt: Date,
  city: string,
  latitude: number,
  longitude: number
}