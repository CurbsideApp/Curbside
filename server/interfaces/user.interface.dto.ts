export interface InitialUserDTO {
  id: string;
  email: string;
  emailVerified: boolean;
  photoUrl?: string;
}

export interface FinalizeUserDTO {
  emailVerified: boolean,
  firstName: string,
  lastName: string,
  city: string,
  longitude: number,
  latitude: number,
}
