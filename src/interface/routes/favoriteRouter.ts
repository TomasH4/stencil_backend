import { Router } from 'express';
import { FavoriteController } from '../controllers/FavoriteController';
import { authenticate } from '../middlewares/authenticate';
import { authorize } from '../middlewares/authorize';

export const favoriteRouter = Router();

favoriteRouter.post(
  '/',
  authenticate,
  authorize('CLIENT'),
  FavoriteController.toggle,
);

favoriteRouter.get(
  '/me',
  authenticate,
  authorize('CLIENT'),
  FavoriteController.getMyFavorites,
);
