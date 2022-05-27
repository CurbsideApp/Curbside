import { NextFunction, Request, Response } from 'express';
import { CustomError } from '../errors/CustomError.class';
import transactionModel from '../models/transaction.model';
const deleteTransaction = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // @ts-ignore
    const userId = req.user.uid;
    const listingId = req.params.listingId;
    const transaction = await transactionModel.deleteTransaction(userId, listingId);
    res.status(200).send({ data: { listing: transaction.id } });
  } catch (error) {
    next(error);
  }
};

const getTransactionByBuyerAndSellerId = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { buyerId, sellerId } = req.query;
    if (!buyerId || !sellerId) {
      throw new CustomError('Buyer or seller not specified.', 400);
      // @ts-ignore
    } else if (req.user.uid !== buyerId) {
      throw new CustomError('Not authorized', 400);
    } else {
      const transaction = await transactionModel.getTransactionByBuyerAndSellerId(buyerId as string, sellerId as string);
      res.status(200).send({ data: transaction });
    }
  } catch (error) {
    next(error);
  }
};

export default {
  deleteTransaction,
  getTransactionByBuyerAndSellerId
};
