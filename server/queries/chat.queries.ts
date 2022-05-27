import { ListingStatus } from '@prisma/client';
import { IChat } from '../interfaces/chat.interface';
import { IListingStatus } from '../interfaces/listing.interface';
import { prisma } from '../prisma/client';

const getChats = async (userId: string, listingId: string | undefined = undefined): Promise<IChat[]> => {
  const chats = await prisma.chat.findMany({
    where: {
      OR: [{ sellerId: userId }, { buyerId: userId }],
      listingId
    },
    include: {
      buyer: {
        select: {
          firstName: true,
          lastName: true
        }
      },
      seller: {
        select: {
          firstName: true,
          lastName: true,
          photoUrl: !!listingId
        }
      },
      listing: {
        select: {
          title: true,
          photoUrls: true,
          status: true,
          currency: true,
          priceInCents: true
        }
      },
      messages: {
        orderBy: {
          createdAt: 'desc'
        },
        take: 1,
        select: {
          senderId: true,
          id: true,
          body: true,
          createdAt: true
        }
      }
    },
    orderBy: {
      updatedAt: 'desc'
    }
  });
  return chats.map((chat) => ({
    id: chat.id,
    buyerId: chat.buyerId,
    currency: chat.listing.currency,
    listingTitle: chat.listing.title,
    listingId: chat.listingId,
    listingStatus: chat.listing.status === ListingStatus.available ? IListingStatus.available : chat.listing.status === ListingStatus.reserved ? IListingStatus.reserved : IListingStatus.sold,
    sellerId: chat.sellerId,
    sellerFirstName: chat.seller.firstName!,
    sellerLastName: chat.seller.lastName!,
    buyerName: `${chat.buyer.firstName} ${chat.buyer.lastName}`,
    priceInCents: chat.listing.priceInCents,
    listingPhotoUrls: [chat.listing.photoUrls[0]],
    lastMessage: { chatId: chat.id, id: chat.messages[0].id, senderId: chat.messages[0].senderId, createdAt: chat.messages[0].createdAt, body: chat.messages[0].body },
    createdAt: chat.createdAt,
    updatedAt: chat.updatedAt
  }));
};

export default {
  getChats
};
