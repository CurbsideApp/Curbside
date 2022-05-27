import { Request, Response, NextFunction } from 'express';
import chatsModel from '../models/chat.model';

const getChatsByUserId = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // @ts-ignore
    const userId = req.user.uid;
    const chats = await chatsModel.getChatsByUserId(userId);
    res.status(200).send({ data: chats });
  } catch (error) {
    next(error);
  }
};

const getUsersByListingIdAndSellerId = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // @ts-ignore
    const sellerId = req.user.uid;
    // @ts-ignore
    const listingId = req.params.listingId;
    const users = await chatsModel.getUsersByListingIdAndSellerId(sellerId, listingId);
    res.status(200).send({ data: users });
  } catch (error) {
    next(error);
  }
};

export default {
  getChatsByUserId,
  getUsersByListingIdAndSellerId
};
