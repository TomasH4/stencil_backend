// BE-50: UpdateAppointmentDto — Zod schema for updating appointment status

import { z } from 'zod';

export const UpdateAppointmentDto = z.object({
  status: z.enum(['CONFIRMED', 'CANCELLED'], {
    error: 'status must be CONFIRMED or CANCELLED',
  }),
});

export type UpdateAppointmentDtoType = z.infer<typeof UpdateAppointmentDto>;
