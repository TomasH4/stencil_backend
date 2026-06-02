// BE-33: IReviewRepository — domain layer interface

import { Review, ReviewWithClient, CreateReviewData } from '../entities/Review';
import { PaginationParams, PaginatedResult } from './ITattooArtistProfileRepository';

export interface IReviewRepository {
  /**
   * Find all reviews for a given artist profile with pagination.
   * Returns reviews enriched with the client's email.
   */
  findAllByArtistId(
    artistProfileId: string,
    pagination: PaginationParams,
  ): Promise<PaginatedResult<ReviewWithClient>>;

  /**
   * Find a single review by ID.
   * Returns null if not found.
   */
  findById(id: string): Promise<Review | null>;

  /**
   * Create and persist a new review.
   */
  create(data: CreateReviewData): Promise<Review>;

  /**
   * Delete a review by ID.
   */
  delete(id: string): Promise<void>;
}
