import { User } from '@prisma/client';
import { IUser } from '../interfaces/user.interface';
import { prisma } from '../prisma/client';

export const addFavorite = async (userId: string, listingId: string): Promise<any> => {
  const dbUser: User = await prisma.user.update({
    where: {
      id: userId
    },
    data: {
      favorites: {
        connect: [{ id: listingId }]
      }
    },
    include: {
      favorites: true
    }
  });
  return dbUser;
};

export const getFavorites = async (userId: string): Promise<IUser| any> => {
  const dbUser: any = await prisma.user.findFirst({
    where: {
      id: userId
    },
    include: {
      favorites: true
    }
  });
  console.log(dbUser.favorites);
  return dbUser.favorites;
};

export default {
  addFavorite,
  getFavorites
  // deleteFavorites
};
