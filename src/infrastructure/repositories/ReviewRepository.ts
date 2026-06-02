// BE-41: ReviewRepository — Prisma implementation of IReviewRepository

import { prisma } from '../database/prisma.client';
import { IReviewRepository } from '../../domain/repositories/IReviewRepository';
import { Review, ReviewWithClient, CreateReviewData } from '../../domain/entities/Review';
import { PaginatedResult, PaginationParams } from '../../domain/repositories/ITattooArtistProfileRepository';
import { getPagination } from '../../shared/utils/paginate';

export class ReviewRepository implements IReviewRepository {
  async findAllByArtistId(
    artistProfileId: string,
    pagination: PaginationParams,
  ): Promise<PaginatedResult<ReviewWithClient>> {
    const { skip, take } = getPagination(pagination.page, pagination.limit);

    const [items, total] = await Promise.all([
      prisma.review.findMany({
        where: { artistProfileId },
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: { client: { select: { email: true } } },
      }),
      prisma.review.count({ where: { artistProfileId } }),
    ]);

    return {
      data: items.map((r: typeof items[number]) => ({
        id: r.id,
        clientId: r.clientId,
        artistProfileId: r.artistProfileId,
        rating: r.rating,
        comment: r.comment,
        createdAt: r.createdAt,
        clientEmail: r.client.email,
      })),
      meta: { page: pagination.page, limit: pagination.limit, total },
    };
  }

  async findById(id: string): Promise<Review | null> {
    const review = await prisma.review.findUnique({ where: { id } });
    if (!review) return null;
    return {
      id: review.id,
      clientId: review.clientId,
      artistProfileId: review.artistProfileId,
      rating: review.rating,
      comment: review.comment,
      createdAt: review.createdAt,
    };
  }

  async create(data: CreateReviewData): Promise<Review> {
    const review = await prisma.review.create({
      data: {
        clientId: data.clientId,
        artistProfileId: data.artistProfileId,
        rating: data.rating,
        comment: data.comment,
      },
    });
    return {
      id: review.id,
      clientId: review.clientId,
      artistProfileId: review.artistProfileId,
      rating: review.rating,
      comment: review.comment,
      createdAt: review.createdAt,
    };
  }

  async delete(id: string): Promise<void> {
    await prisma.review.delete({ where: { id } });
  }
}
