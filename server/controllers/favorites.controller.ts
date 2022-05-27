import { NextFunction, Request, Response } from 'express';
import { IUserFavoritesPackage } from '../interfaces/favorite.interface';
import favoriteModel from '../models/favorite.model';

const addFavorite = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // @ts-ignore
    const userId = req.user.uid;
    const favoriteId: string = req.body.favoriteId;
    const userFavoritesPackage : IUserFavoritesPackage = await favoriteModel.addFavorite(userId, favoriteId);
    res.status(200).send({ data: { ...userFavoritesPackage } });
  } catch (error) {
    next(error);
  }
};

const getFavorites = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // @ts-ignore
    const userId = req.user.uid;
    const userFavoritesPackage: IUserFavoritesPackage = await favoriteModel.getFavorites(userId);
    res.status(200).send({ data: { ...userFavoritesPackage } });
  } catch (error) {
    next(error);
  }
};

const deleteFavorite = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // @ts-ignore
    const userId = req.user.uid;
    const favoriteId: string = req.body.favoriteId;
    const userFavoritesPackage: IUserFavoritesPackage = await favoriteModel.deleteFavorite(userId, favoriteId);
    res.status(200).send({ data: { ...userFavoritesPackage } });
  } catch (error) {
    next(error);
  }
};

export default {
  addFavorite,
  getFavorites,
  deleteFavorite
};
