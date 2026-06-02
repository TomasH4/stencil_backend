// BE-44: LoginDto — Zod schema for user login

import { z } from 'zod';

export const LoginDto = z.object({
  email: z.string().email('Must be a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

export type LoginDtoType = z.infer<typeof LoginDto>;
