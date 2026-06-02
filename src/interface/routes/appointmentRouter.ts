// BE-78: appointmentRouter — /api/v1/appointments routes

import { Router } from 'express';
import { AppointmentController } from '../controllers/AppointmentController';
import { authenticate } from '../middlewares/authenticate';
import { authorize } from '../middlewares/authorize';
import { validateBody } from '../middlewares/validateBody';
import { CreateAppointmentDto } from '../../application/dtos/appointment/CreateAppointmentDto';
import { UpdateAppointmentDto } from '../../application/dtos/appointment/UpdateAppointmentDto';

export const appointmentRouter = Router();

// GET /api/v1/appointments/me — CLIENT: own appointments
appointmentRouter.get('/me', authenticate, AppointmentController.getClientAppointments);

// GET /api/v1/appointments/artist/me — TATTOO_ARTIST: own appointment list
appointmentRouter.get(
  '/artist/me',
  authenticate,
  authorize('TATTOO_ARTIST'),
  AppointmentController.getArtistAppointments,
);

// POST /api/v1/appointments — CLIENT only
appointmentRouter.post(
  '/',
  authenticate,
  authorize('CLIENT'),
  validateBody(CreateAppointmentDto),
  AppointmentController.create,
);

// PATCH /api/v1/appointments/:id/status — authenticated (client or artist)
appointmentRouter.patch(
  '/:id/status',
  authenticate,
  validateBody(UpdateAppointmentDto),
  AppointmentController.updateStatus,
);

// DELETE /api/v1/appointments/:id — authenticated (cancels the appointment)
appointmentRouter.delete('/:id', authenticate, AppointmentController.cancel);
