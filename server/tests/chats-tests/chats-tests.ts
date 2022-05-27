import { getChatsByUserIdTests } from './chats-get-tests';

export const chatsTests = () : void => {
  describe('/chats', () => {
    getChatsByUserIdTests();
  });
};
