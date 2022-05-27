import { IUserFavoritesPackage } from '../interfaces/favorite.interface';
import { prisma } from '../prisma/client';

export const addFavorite = async (userId: string, listingId: string): Promise<IUserFavoritesPackage> => {
  const dbUser: any = await prisma.user.update({
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
  const userFavoritesPackage = { user: dbUser.id, favorites: dbUser.favorites };
  return userFavoritesPackage;
};

export const getFavorites = async (userId: string): Promise<IUserFavoritesPackage> => {
  const dbUser: any = await prisma.user.findFirst({
    where: {
      id: userId
    },
    include: {
      favorites: true
    }
  });
  const userFavoritesPackage = { user: dbUser.id, favorites: dbUser.favorites };
  return userFavoritesPackage;
};

export const deleteFavorite = async (userId:string, favoriteId:any): Promise<any> => {
  console.log('favorite', favoriteId);
  const dbUser: any = await prisma.user.update({
    where: {
      id: userId
    },
    data: {
      favorites: {
        disconnect: [{ id: favoriteId }]
      }
    },
    include: {
      favorites: true
    }
  });
  const userFavoritesPackage = { user: dbUser.id, favorites: dbUser.favorites };
  return userFavoritesPackage;
};

export default {
  addFavorite,
  getFavorites,
  deleteFavorite
};
