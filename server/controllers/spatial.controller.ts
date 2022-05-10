import { NextFunction, Request, Response } from 'express';
// import spatialModel from '../models/users.model';
import { getListings } from '../models/spatial.model';

export const spatialSearch = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const listings: any = await getListings();
    res.status(200).send({ listings });
  } catch (error) {
    next(error);
  }
};
