import { CustomError } from '../../errors/CustomError.class';
import { CustomErrorMessageObject } from '../../errors/CustomErrorMessageObject.interface';
import { AddRatingDTO } from '../../interfaces/rating.interface.dto';
import { prisma } from '../../prisma/client';

export const ratingModelErrorMessages = {
  invalidRating: 'Invalid Rating.',
  invalidUserId: 'The user associated with this listing has not been found'
};

export const addRatingInputValidation = async (ratingDetails:AddRatingDTO): Promise<void> => {
  const errorMessages: CustomErrorMessageObject = {};
  // Check to make sure the rating is between 1 and 5
  if (ratingDetails.rating < 1 || ratingDetails.rating > 5) {
    errorMessages.title = ratingModelErrorMessages.invalidRating;
  }
  // Check that both users are still in the database
  const seller = await prisma.user.findUnique({ where: { id: ratingDetails.sellerId } });
  const buyer = await prisma.user.findUnique({ where: { id: ratingDetails.buyerId } });
  if (!seller || !buyer) {
    errorMessages.user = ratingModelErrorMessages.invalidUserId;
  }
  // Throw error if any checks above are true
  if (Object.keys(errorMessages).length) {
    throw new CustomError(JSON.stringify(errorMessages), 400);
  }
};
