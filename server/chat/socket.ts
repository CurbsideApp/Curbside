/* eslint-disable n/no-callback-literal */
import { Message } from '@prisma/client';
import { Server, Socket } from 'socket.io';
import { IMessage } from '../interfaces/message.interface';
import { prisma } from '../prisma/client';

export const socketListener = (io: Server): Server => io.on('connection', (socket: Socket) => {
  socket.on('message', async (body: string, listingId: string, chatId: string | undefined, cb: ({ ok, data }: { ok: boolean, data: { chatId: string, message: IMessage } }) => void) => {
    // @ts-ignore
    const senderId = socket.user.id;
    if (!chatId) {
      const listing = await prisma.listing.findUnique({ where: { id: listingId } });
      if (listing) {
        const chat = await prisma.chat.create(
          {
            data: {
              buyerId: senderId,
              listingId: listing.id,
              sellerId: listing.userId
            }
          });
        chatId = chat.id;
      }
    }
    if (chatId) {
      const message = await prisma.message.create({ data: { body, chatId, senderId } });
      cb({ ok: true, data: { chatId, message } });
      // io.in(chatId!).emit('messageResponse', { ok: true, data: { message } });
      socket.to(chatId!).emit('messageResponse', { ok: true, data: { message } });
    }
  });

  socket.on('getChat', async (listingId: string, buyerId: string, cb: ({ ok, data }: { ok?: boolean, data: { chatId?: string, messages?: IMessage[], error?: string } }) => void) => {
    // @ts-ignore
    try {
      const chat = await prisma.chat.findFirst({
        where: {
          AND: [
            {
              listingId
            },
            {
              buyerId
            }
          ]
        }
      });
      if (!chat) {
        cb({ ok: false, data: { error: 'Chat not found.' } });
      } else {
        const messages = await prisma.message.findMany({
          where: {
            chatId: chat.id
          }
        });

        cb(
          {
            ok: true,
            data: {
              chatId: chat.id,
              messages: messages.map((message: Message) => ({ id: message.id, chatId: message.chatId, body: message.body, createdAt: message.createdAt, senderId: message.senderId }))
            }
          });
      }
    } catch (e) {
      console.log(e);
      cb({ ok: false, data: { error: 'Chat not found.' } });
    }
  });

  socket.on('joinChat', async (chatId: string) => {
    const chat = await prisma.chat.findUnique({
      where: {
        id: chatId
      }
    });
    // @ts-ignore
    if (chat && (chat.buyerId === socket.user.id || chat.sellerId === socket.user.id)) {
      socket.join(chatId);
    }
  });
});
