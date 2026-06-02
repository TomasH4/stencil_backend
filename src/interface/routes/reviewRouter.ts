// BE-77: reviewRouter — /api/v1/reviews routes

import { Router } from 'express';
import { ReviewController } from '../controllers/ReviewController';
import { authenticate } from '../middlewares/authenticate';
import { authorize } from '../middlewares/authorize';
import { validateBody } from '../middlewares/validateBody';
import { CreateReviewDto } from '../../application/dtos/review/CreateReviewDto';

export const reviewRouter = Router();

// GET /api/v1/reviews/artist/:artistId — public, paginated
reviewRouter.get('/artist/:artistId', ReviewController.getByArtist);

// POST /api/v1/reviews — CLIENT only
reviewRouter.post(
  '/',
  authenticate,
  authorize('CLIENT'),
  validateBody(CreateReviewDto),
  ReviewController.create,
);

// DELETE /api/v1/reviews/:id — CLIENT only (owner)
reviewRouter.delete('/:id', authenticate, authorize('CLIENT'), ReviewController.delete);
