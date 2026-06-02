// BE-43: RegisterDto — Zod schema for user registration

import { z } from 'zod';

export const RegisterDto = z.object({
  email: z.string().email('Must be a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  role: z.enum(['CLIENT', 'TATTOO_ARTIST'], {
    error: 'Role must be CLIENT or TATTOO_ARTIST',
  }),
});

export type RegisterDtoType = z.infer<typeof RegisterDto>;
