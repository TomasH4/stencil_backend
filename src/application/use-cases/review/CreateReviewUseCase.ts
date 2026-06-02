// BE-59: CreateReviewUseCase — CLIENT creates a review for an artist

import { IReviewRepository } from '../../../domain/repositories/IReviewRepository';
import { Review } from '../../../domain/entities/Review';
import { CreateReviewDtoType } from '../../dtos/review/CreateReviewDto';
import { AppError } from '../../../shared/errors/AppError';
import { Role } from '../../../domain/entities/User';

export class CreateReviewUseCase {
  constructor(private readonly reviewRepo: IReviewRepository) {}

  async execute(
    clientId: string,
    clientRole: Role,
    dto: CreateReviewDtoType,
  ): Promise<Review> {
    if (clientRole !== Role.CLIENT) {
      throw new AppError('Only clients can leave reviews', 403);
    }

    return this.reviewRepo.create({
      clientId,
      artistProfileId: dto.artistProfileId,
      rating: dto.rating,
      comment: dto.comment,
    });
  }
}
