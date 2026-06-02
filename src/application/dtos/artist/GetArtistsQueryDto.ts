// BE-47: GetArtistsQueryDto — Zod schema for query string filters on GET /artists

import { z } from 'zod';

export const GetArtistsQueryDto = z.object({
  style: z.string().optional(),
  location: z.string().optional(),
  priceMin: z.coerce.number().positive().optional(),
  priceMax: z.coerce.number().positive().optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(50).default(10),
});

export type GetArtistsQueryDtoType = z.infer<typeof GetArtistsQueryDto>;
