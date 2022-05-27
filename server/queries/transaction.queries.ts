import { Transaction } from '@prisma/client';
import { CustomError } from '../errors/CustomError.class';
import { TRANSACTION_NOT_FOUND } from '../errors/SharedErrorMessages';
import { ITransaction, ITransactionDTO } from '../interfaces/transaction.interface';
import { prisma } from '../prisma/client';

const convertDbTransactionToTransaction = (dbTransaction: Transaction): ITransaction => ({
  id: dbTransaction.id,
  sellerId: dbTransaction.sellerId,
  buyerId: dbTransaction.buyerId ?? undefined,
  createdAt: dbTransaction.createdAt,
  listingId: dbTransaction.listingId
});

export const addTransaction = async (newTransactionDetails: ITransactionDTO): Promise<ITransaction> => {
  const dbTransaction = await prisma.transaction.create({ data: newTransactionDetails });
  const transaction = convertDbTransactionToTransaction(dbTransaction);
  return transaction;
};

export const updateTransaction = async (updatedTransactionDetails: ITransactionDTO): Promise<ITransaction> => {
  const dbTransaction = await prisma.transaction.update({
    where: { id: updatedTransactionDetails.id },
    data: updatedTransactionDetails
  });
  const transaction = convertDbTransactionToTransaction(dbTransaction);
  return transaction;
};

const deleteTransaction = async (userId: string, listingId: string): Promise<ITransaction> => {
  const transaction = await prisma.transaction.findFirst({
    where: {
      listingId,
      sellerId: userId
    }
  });
  if (!transaction) {
    throw new CustomError(TRANSACTION_NOT_FOUND, 404);
  }
  const dbTransaction = await prisma.transaction.delete({
    where: {
      id: transaction.id!
    }
  });
  return convertDbTransactionToTransaction(dbTransaction);
};

const getTransactionByBuyerAndSellerId = async (buyerId: string, sellerId: string): Promise<ITransaction | null> => {
  const dbTransaction = await prisma.transaction.findFirst({
    where: {
      buyerId, sellerId
    }
  });
  if (!dbTransaction) {
    return null;
  }
  return convertDbTransactionToTransaction(dbTransaction);
};

export default {
  addTransaction,
  deleteTransaction,
  getTransactionByBuyerAndSellerId
};
