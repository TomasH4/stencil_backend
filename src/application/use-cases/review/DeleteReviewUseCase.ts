// BE-60: DeleteReviewUseCase — CLIENT deletes their own review

import { IReviewRepository } from '../../../domain/repositories/IReviewRepository';
import { AppError } from '../../../shared/errors/AppError';

export class DeleteReviewUseCase {
  constructor(private readonly reviewRepo: IReviewRepository) {}

  async execute(reviewId: string, userId: string): Promise<void> {
    const review = await this.reviewRepo.findById(reviewId);
    if (!review) {
      throw new AppError('Review not found', 404);
    }

    // Only the author can delete their review
    if (review.clientId !== userId) {
      throw new AppError('You do not have permission to delete this review', 403);
    }

    await this.reviewRepo.delete(reviewId);
  }
}
