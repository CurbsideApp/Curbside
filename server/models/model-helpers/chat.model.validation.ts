import { CustomError } from '../../errors/CustomError.class';
import { CustomErrorMessageObject } from '../../errors/CustomErrorMessageObject.interface';
import { CreateChatInputDTO } from '../../interfaces/chat.interface.dto';
import { prisma } from '../../prisma/client';

export const chatsModelErrorMessages = {

  userNotFound: 'A user associated with this chat has not been found.',
  listingNotFound: 'The listing associated with this chat has not been found.'
};

export const addChatInputValidation = async (chatDetails: CreateChatInputDTO): Promise<void> => {
  const errorMessages: CustomErrorMessageObject = {};

  const listing = await prisma.listing.findUnique({ where: { id: chatDetails.listingId } });
  if (!listing) {
    errorMessages.user = chatsModelErrorMessages.listingNotFound;
  }
  const seller = await prisma.user.findUnique({ where: { id: chatDetails.sellerId } });
  const buyer = await prisma.user.findUnique({ where: { id: chatDetails.buyerId } });
  if (!seller || !buyer) {
    errorMessages.user = chatsModelErrorMessages.userNotFound;
  }
  if (Object.keys(errorMessages).length) {
    throw new CustomError(JSON.stringify(errorMessages), 400);
  }
};
