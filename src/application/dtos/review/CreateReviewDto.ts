// BE-48: CreateReviewDto — Zod schema for creating a review

import { z } from 'zod';

export const CreateReviewDto = z.object({
  artistProfileId: z.string().uuid('artistProfileId must be a valid UUID'),
  rating: z
    .number()
    .int('Rating must be an integer')
    .min(1, 'Rating must be at least 1')
    .max(5, 'Rating cannot exceed 5'),
  comment: z.string().min(1, 'Comment cannot be empty'),
});

export type CreateReviewDtoType = z.infer<typeof CreateReviewDto>;
