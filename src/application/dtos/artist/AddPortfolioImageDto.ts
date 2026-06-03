import { z } from 'zod';

export const AddPortfolioImageDto = z.object({
  description: z.string().optional(),
});

export type AddPortfolioImageDto = z.infer<typeof AddPortfolioImageDto>;
