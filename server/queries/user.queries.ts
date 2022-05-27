import { User } from '@prisma/client';
import { CustomError } from '../errors/CustomError.class';
import { USER_NOT_FOUND } from '../errors/SharedErrorMessages';
import { IListing } from '../interfaces/listing.interface';
import { IdbSelectUserDetails } from '../interfaces/listing.interface.dto';
import { ProfileDTO } from '../interfaces/profile.interface.dto';
import { IUser, IUserInfoSelect } from '../interfaces/user.interface';
import { FinalizeUserDTO, InitialUserDTO } from '../interfaces/user.interface.dto';
import { prisma } from '../prisma/client';
import listingsQueries from './listing.queries';
import converterHelpers from './query-helpers/converter.helpers';

export const createInitialUser = async (userDetails: InitialUserDTO): Promise<IUser> => {
  const dbUser: User = await prisma.user.create({ data: userDetails });
  const user: IUser = converterHelpers.convertDataBaseUserToUser(dbUser);
  return user;
};

export const finalizeUser = async (userId: string, userDetails: FinalizeUserDTO): Promise<IUser> => {
  const dbUser: User = await prisma.user.update({
    where: {
      id: userId
    },
    data: userDetails
  });
  const user: IUser = converterHelpers.convertDataBaseUserToUser(dbUser);
  return user;
};

export const getUserByEmail = async (email: string): Promise<IUser | null> => {
  const dbUser = await prisma.user.findUnique({ where: { email } });
  if (!dbUser) {
    return null;
  }
  const user: IUser = converterHelpers.convertDataBaseUserToUser(dbUser);
  return user;
};
export const getUserById = async (id: string): Promise<IUser | null> => {
  const dbUser = await prisma.user.findUnique({ where: { id } });
  if (!dbUser) {
    return null;
  }
  const user: IUser = converterHelpers.convertDataBaseUserToUser(dbUser);
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

  const listings: IListing[] = await listingsQueries.getListingsByUserId(userId);
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
  const listings: IListing[] = await listingsQueries.getListingsByUserId(userId);
  result.listings = listings;
  if (result.user === undefined) {
    throw new CustomError(USER_NOT_FOUND, 404);
  }
  return result;
};

export const getSelectUserInfo = async (userId: string): Promise<IUserInfoSelect> => {
  const dbUserInfo: IdbSelectUserDetails | null = await prisma.user.findFirst({
    where: {
      id: userId
    },
    select: {
      firstName: true,
      lastName: true,
      photoUrl: true
    }

  });
  if (dbUserInfo === null || undefined) { throw new CustomError(USER_NOT_FOUND, 404); }
  return converterHelpers.convertDBSelectUserDetailsToDetails(dbUserInfo);
};

export default {
  createInitialUser,
  finalizeUser,
  getUserByEmail,
  getUserById,
  getForeignProfile,
  getOwnProfile,
  getSelectUserInfo
};
