// BE-73: ReviewController — manage reviews for artist profiles

import { Request, Response, NextFunction } from 'express';
import { ReviewRepository } from '../../infrastructure/repositories/ReviewRepository';
import { GetReviewsByArtistUseCase } from '../../application/use-cases/review/GetReviewsByArtistUseCase';
import { CreateReviewUseCase } from '../../application/use-cases/review/CreateReviewUseCase';
import { DeleteReviewUseCase } from '../../application/use-cases/review/DeleteReviewUseCase';
import { CreateReviewDtoType } from '../../application/dtos/review/CreateReviewDto';
import { Role } from '../../domain/entities/User';

const reviewRepo = new ReviewRepository();
const getReviewsByArtistUseCase = new GetReviewsByArtistUseCase(reviewRepo);
const createReviewUseCase = new CreateReviewUseCase(reviewRepo);
const deleteReviewUseCase = new DeleteReviewUseCase(reviewRepo);

export const ReviewController = {
  async getByArtist(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const artistId = req.params['artistId'] as string;
      const page = Number(req.query['page']) || 1;
      const limit = Number(req.query['limit']) || 10;
      const result = await getReviewsByArtistUseCase.execute(artistId, page, limit);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  },

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const clientId = req.user!.id;
      const clientRole = req.user!.role as Role;
      const result = await createReviewUseCase.execute(
        clientId,
        clientRole,
        req.body as CreateReviewDtoType,
      );
      res.status(201).json({ data: result });
    } catch (error) {
      next(error);
    }
  },

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const reviewId = req.params['id'] as string;
      const userId = req.user!.id;
      await deleteReviewUseCase.execute(reviewId, userId);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  },
};
