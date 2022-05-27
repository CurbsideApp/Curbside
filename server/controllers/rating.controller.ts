import { NextFunction, Request, Response } from 'express';
import { AddRatingDTO } from '../interfaces/rating.interface.dto';
import ratingsModel from '../models/rating.model';

export const addRatings = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const ratingDetails: AddRatingDTO = req.body;
    const rating = await ratingsModel.addRating(ratingDetails);
    res.status(200).send({ data: { rating } });
  } catch (error) {
    next(error);
  }
};

export default {
  addRatings
};
