import { User } from '@prisma/client';
import { CustomError } from '../errors/CustomError.class';
import { USER_NOT_FOUND, USER_PARSING_ERROR } from '../errors/SharedErrorMessages';
import { IListing } from '../interfaces/listing.interface';
import { ProfileDTO } from '../interfaces/profile.interface.dto';
import { IUser } from '../interfaces/user.interface';
import { FinalizeUserDTO, InitialUserDTO } from '../interfaces/users.interface.dto';
import { prisma } from '../prisma/client';
import { getListingsByUserId } from './listingsQueries';

const convertDataBaseUserToUser = (dbUser: User): IUser => {
  try {
    const user: IUser = {
      id: dbUser.id,
      email: dbUser.email,
      emailVerified: dbUser.emailVerified,
      createdAt: dbUser.createdAt,
      city: dbUser.city ?? undefined,
      firstName: dbUser.firstName ?? undefined,
      lastName: dbUser.lastName ?? undefined,
      latitude: dbUser.latitude ?? undefined,
      longitude: dbUser.longitude ?? undefined,
      photoUrl: dbUser.photoUrl ?? undefined
    };
    return user;
  } catch (error) {
    throw new CustomError(USER_PARSING_ERROR, 400);
  }
};

export const createInitialUser = async (userDetails: InitialUserDTO): Promise<IUser> => {
  const dbUser: User = await prisma.user.create({ data: userDetails });
  const user: IUser = convertDataBaseUserToUser(dbUser);
  return user;
};

export const finalizeUser = async (userId: string, userDetails: FinalizeUserDTO): Promise<IUser> => {
  const dbUser: User = await prisma.user.update({
    where: {
      id: userId
    },
    data: userDetails
  });
  const user: IUser = convertDataBaseUserToUser(dbUser);
  return user;
};

export const getUserByEmail = async (email: string): Promise<IUser | null> => {
  const dbUser = await prisma.user.findUnique({ where: { email } });
  if (!dbUser) {
    return null;
  }
  const user: IUser = convertDataBaseUserToUser(dbUser);
  return user;
};
export const getUserById = async (id: string): Promise<IUser | null> => {
  const dbUser = await prisma.user.findUnique({ where: { id } });
  if (!dbUser) {
    return null;
  }
  const user: IUser = convertDataBaseUserToUser(dbUser);
  return user;
};

export const getForeignProfile = async (userId: string): Promise<ProfileDTO> => {
  const result: ProfileDTO = <ProfileDTO>{ };
  const user: IUser | null = await getUserById(userId);
  if (!user) {
    throw new CustomError(USER_NOT_FOUND, 404);
  }
  result.user = {
    id: user.id,
    firstName: user.firstName!,
    lastName: user.lastName!,
    photoUrl: user.photoUrl,
    createdAt: user.createdAt
  };

  const listings: IListing[] = await getListingsByUserId(userId);
  result.listings = listings;
  if (result.user === undefined) {
    throw new CustomError(USER_NOT_FOUND, 404);
  }
  return result;
};

export const getOwnProfile = async (userId: string): Promise<ProfileDTO> => {
  const result: ProfileDTO = <ProfileDTO>{ };
  const user: IUser | null = await getUserById(userId);
  if (!user) {
    throw new CustomError(USER_NOT_FOUND, 404);
  }
  result.user = user;
  const listings: IListing[] = await getListingsByUserId(userId);
  result.listings = listings;
  if (result.user === undefined) {
    throw new CustomError(USER_NOT_FOUND, 404);
  }
  return result;
};

export default {
  createInitialUser,
  finalizeUser,
  getUserByEmail,
  getUserById,
  getForeignProfile,
  getOwnProfile
};
