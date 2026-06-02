// BE-49: CreateAppointmentDto — Zod schema for booking an appointment

import { z } from 'zod';

export const CreateAppointmentDto = z.object({
  artistProfileId: z.string().uuid('artistProfileId must be a valid UUID'),
  date: z
    .string()
    .datetime({ message: 'date must be a valid ISO 8601 datetime string' })
    .transform((val) => new Date(val)),
  notes: z.string().optional(),
});

export type CreateAppointmentDtoType = z.infer<typeof CreateAppointmentDto>;
