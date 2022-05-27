import { CustomError } from '../errors/CustomError.class';
import { USER_NOT_FOUND } from '../errors/SharedErrorMessages';
import { AddRatingDTO, IRating } from '../interfaces/rating.interface.dto';
import { prisma } from '../prisma/client';

export const createRating = async (ratingDetails :AddRatingDTO): Promise<IRating> => {
  const dbRating = await prisma.rating.create({
    data: {
      ...ratingDetails
    }
  });
  return dbRating;
};

export const getUserRating = async (userId: string): Promise<number> => {
  const dbUserRatings: {rating:number}[] | null = await prisma.rating.findMany({
    where: {
      sellerId: userId
    },
    select: {
      rating: true
    }
  });

  if (dbUserRatings === null || undefined) { throw new CustomError(USER_NOT_FOUND, 404); }

  // Get Average rating
  const ratingArr = Object.values(dbUserRatings);
  const sum = (acc: number, obj:{rating:number}): number => (acc + obj.rating);
  const avg = ratingArr.reduce(sum, 0) / ratingArr.length;
  return avg;
};

export const getRatingByBuyerAndSeller = async (buyerId: string, sellerId: string): Promise<IRating | null> => {
  const rating = prisma.rating.findFirst({
    where: {
      buyerId,
      sellerId
    }
  });
  return rating;
};

export default {
  createRating,
  getUserRating,
  getRatingByBuyerAndSeller
};
