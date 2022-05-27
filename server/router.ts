import { Request, Response, Router } from 'express';
import userController from './controllers/user.controller';
import listingController from './controllers/listing.controller';
import { fullUserRequired, loginRequired } from './middlewares/login-required.middleware';
import chatController from './controllers/chat.controller';
import ratingController from './controllers/rating.controller';
import favoriteController from './controllers/favorites.controller';
import transactionController from './controllers/transaction.controller';

export const router = Router();

router.post('/users', loginRequired, userController.addInitialUser);

router.get('/users/:id', userController.getUserProfile);
router.patch('/users/:id', loginRequired, userController.finalizeUser);

router.get('/listings', listingController.getListings);
router.post('/listings', fullUserRequired, listingController.addListing);

router.get('/listings/:id', listingController.getListingByListingId);
router.patch('/listings/:id', fullUserRequired, listingController.patchListingByListingId);

router.get('/chats', fullUserRequired, chatController.getChatsByUserId);

router.post('/ratings', loginRequired, ratingController.addRatings);

router.patch('/favorites', fullUserRequired, favoriteController.addFavorite);
router.get('/favorites', fullUserRequired, favoriteController.getFavorites);
router.delete('/favorites', fullUserRequired, favoriteController.deleteFavorite);

router.get('/chats', fullUserRequired, chatController.getChatsByUserId);
router.get('/chats/:listingId', fullUserRequired, chatController.getUsersByListingIdAndSellerId);

router.post('/ratings', fullUserRequired, ratingController.addRatings);

router.delete('/transactions/:listingId', fullUserRequired, transactionController.deleteTransaction);
router.get('/transactions', fullUserRequired, transactionController.getTransactionByBuyerAndSellerId);

router.get('/login', fullUserRequired, (req: Request, res: Response) => {
  console.log('LOGIN');
  res.send({
    data: {
      user: {
        // @ts-ignore
        id: req.user.uid,
        // @ts-ignore
        email: req.user.email
      }
    }
  });
});
