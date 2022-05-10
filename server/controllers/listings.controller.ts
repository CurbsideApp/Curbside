import { NextFunction, Request, Response } from 'express';
import { AddListingDTO } from '../interfaces/listings.interface.dto';
import listingsModel from '../models/listings.model';

const addListing = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const listingDetails: AddListingDTO = req.body;
    const listing = await listingsModel.addListing(listingDetails);
    res.status(200).send({ listing });
  } catch (error) {
    next(error);
  }
};

export default {
  addListing
};
