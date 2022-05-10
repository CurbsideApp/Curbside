import { Router } from 'express';
import usersController from './controllers/users.controller';
import listingsController from './controllers/listings.controller';
import { loginRequired } from './middlewares/login-required.middleware';
import { spatialSearch } from './controllers/spatial.controller';

export const router = Router();

router.post('/users', usersController.addInitialUser);

router.patch('/users/:id', loginRequired, usersController.finalizeUser);

router.post('/listings', listingsController.addListing);

router.get('/listings/spatial', spatialSearch);
