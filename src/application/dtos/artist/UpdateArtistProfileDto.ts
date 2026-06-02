// BE-46: UpdateArtistProfileDto — partial version of CreateArtistProfileDto (Zod v4 compatible)
// Note: In Zod v4, .partial() cannot be used on refined schemas.
// We define the partial schema directly from the base object fields.

import { z } from 'zod';

export const UpdateArtistProfileDto = z.object({
  bio: z.string().min(1, 'Bio is required').optional(),
  style: z.string().min(1, 'Style is required').optional(),
  location: z.string().min(1, 'Location is required').optional(),
  priceMin: z.number().positive('priceMin must be a positive number').optional(),
  priceMax: z.number().positive('priceMax must be a positive number').optional(),
});

export type UpdateArtistProfileDtoType = z.infer<typeof UpdateArtistProfileDto>;
