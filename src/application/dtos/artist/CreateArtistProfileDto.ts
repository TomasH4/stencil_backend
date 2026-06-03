// BE-45: CreateArtistProfileDto — Zod schema for creating an artist profile

import { z } from 'zod';

export const CreateArtistProfileDto = z
  .object({
    name: z.string().min(2, 'Name must be at least 2 characters').optional(),
    bio: z.string().min(1, 'Bio is required'),
    style: z.string().min(1, 'Style is required'),
    location: z.string().min(1, 'Location is required'),
    priceMin: z.number().positive('priceMin must be a positive number'),
    priceMax: z.number().positive('priceMax must be a positive number'),
  })
  .refine((data) => data.priceMax > data.priceMin, {
    message: 'priceMax must be greater than priceMin',
    path: ['priceMax'],
  });

export type CreateArtistProfileDtoType = z.infer<typeof CreateArtistProfileDto>;
