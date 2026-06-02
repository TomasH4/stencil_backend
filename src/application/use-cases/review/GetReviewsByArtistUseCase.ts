// BE-58: GetReviewsByArtistUseCase — list reviews for an artist profile

import { IReviewRepository } from '../../../domain/repositories/IReviewRepository';
import { ReviewWithClient } from '../../../domain/entities/Review';
import { PaginatedResult } from '../../../domain/repositories/ITattooArtistProfileRepository';

export class GetReviewsByArtistUseCase {
  constructor(private readonly reviewRepo: IReviewRepository) {}

  async execute(
    artistProfileId: string,
    page: number,
    limit: number,
  ): Promise<PaginatedResult<ReviewWithClient>> {
    return this.reviewRepo.findAllByArtistId(artistProfileId, { page, limit });
  }
}
