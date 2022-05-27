import { CustomError } from '../errors/CustomError.class';
import { USER_NOT_FOUND } from '../errors/SharedErrorMessages';
import { IUserFavoritesPackage } from '../interfaces/favorite.interface';
import favoriteQueries from '../queries/favorite.queries';

const addFavorite = async (userId: string, favorites: string): Promise<IUserFavoritesPackage> => {
  try {
    const userFavoritesPackage: IUserFavoritesPackage = await favoriteQueries.addFavorite(userId, favorites);
    if (!userFavoritesPackage) {
      throw new CustomError(USER_NOT_FOUND, 404);
    }
    return userFavoritesPackage;
  } catch (error) {
    console.log('/models/favorites.model addFavorite ERROR', error);
    throw error;
  }
};

const getFavorites = async (userId: string): Promise<IUserFavoritesPackage> => {
  try {
    const userFavoritesPackage: IUserFavoritesPackage = await favoriteQueries.getFavorites(userId);
    if (!userFavoritesPackage) {
      throw new CustomError(USER_NOT_FOUND, 404);
    }
    return userFavoritesPackage;
  } catch (error) {
    console.log('/model/favorites.model getFavorites ERROR', error);
    throw error;
  }
};

const deleteFavorite = async (userId: string, favorites: string): Promise<IUserFavoritesPackage> => {
  try {
    const userFavoritesPackage: IUserFavoritesPackage = await favoriteQueries.deleteFavorite(userId, favorites);
    if (!userFavoritesPackage) {
      throw new CustomError(USER_NOT_FOUND, 404);
    }
    return userFavoritesPackage;
  } catch (error) {
    console.log('/models/favorites.model deleteFavorite');
    throw error;
  }
};

export default {
  addFavorite,
  getFavorites,
  deleteFavorite
};
