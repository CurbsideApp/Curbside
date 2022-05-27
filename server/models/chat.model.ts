import { getListingById } from '../queries/listing.queries';
import { CustomError } from '../errors/CustomError.class';
import { LISTING_NOT_FOUND, USER_NOT_FOUND } from '../errors/SharedErrorMessages';
import { IChat } from '../interfaces/chat.interface';
import chatQueries from '../queries/chat.queries';
import { getUserById } from '../queries/user.queries';

const getChatsByUserId = async (userId: string): Promise<IChat[]> => {
  const user = await getUserById(userId);
  if (!user) {
    throw new CustomError(USER_NOT_FOUND, 404);
  }
  const chats = await chatQueries.getChats(userId);
  return chats;
};

const getUsersByListingIdAndSellerId = async (sellerId: string, listingId: string): Promise<{buyerName: string, buyerId: string}[]> => {
  const seller = await getUserById(sellerId);
  if (!seller) {
    throw new CustomError(USER_NOT_FOUND, 404);
  }
  const listing = await getListingById(listingId);
  if (!listing) {
    throw new CustomError(LISTING_NOT_FOUND, 404);
  }
  if (listing.userId !== sellerId) {
    throw new CustomError('Unauthorized', 400);
  }
  const chats = await chatQueries.getChats(sellerId, listingId);
  return chats.map((chat: IChat) => ({ buyerName: chat.buyerName, buyerId: chat.buyerId, photoUrl: chat.buyerPhotoUrl }));
};

export default {
  getChatsByUserId,
  getUsersByListingIdAndSellerId
};
