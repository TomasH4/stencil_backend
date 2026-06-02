// BE-74: AppointmentController — manage appointments

import { Request, Response, NextFunction } from 'express';
import { AppointmentRepository } from '../../infrastructure/repositories/AppointmentRepository';
import { TattooArtistProfileRepository } from '../../infrastructure/repositories/TattooArtistProfileRepository';
import { GetClientAppointmentsUseCase } from '../../application/use-cases/appointment/GetClientAppointmentsUseCase';
import { GetArtistAppointmentsUseCase } from '../../application/use-cases/appointment/GetArtistAppointmentsUseCase';
import { CreateAppointmentUseCase } from '../../application/use-cases/appointment/CreateAppointmentUseCase';
import { UpdateAppointmentStatusUseCase } from '../../application/use-cases/appointment/UpdateAppointmentStatusUseCase';
import { CancelAppointmentUseCase } from '../../application/use-cases/appointment/CancelAppointmentUseCase';
import { CreateAppointmentDtoType } from '../../application/dtos/appointment/CreateAppointmentDto';
import { UpdateAppointmentDtoType } from '../../application/dtos/appointment/UpdateAppointmentDto';
import { Role } from '../../domain/entities/User';

const appointmentRepo = new AppointmentRepository();
const artistRepo = new TattooArtistProfileRepository();

const getClientAppointmentsUseCase = new GetClientAppointmentsUseCase(appointmentRepo);
const getArtistAppointmentsUseCase = new GetArtistAppointmentsUseCase(artistRepo, appointmentRepo);
const createAppointmentUseCase = new CreateAppointmentUseCase(appointmentRepo);
const updateAppointmentStatusUseCase = new UpdateAppointmentStatusUseCase(appointmentRepo, artistRepo);
const cancelAppointmentUseCase = new CancelAppointmentUseCase(appointmentRepo);

export const AppointmentController = {
  async getClientAppointments(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const clientId = req.user!.id;
      const page = Number(req.query['page']) || 1;
      const limit = Number(req.query['limit']) || 10;
      const result = await getClientAppointmentsUseCase.execute(clientId, page, limit);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  },

  async getArtistAppointments(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const page = Number(req.query['page']) || 1;
      const limit = Number(req.query['limit']) || 10;
      const result = await getArtistAppointmentsUseCase.execute(userId, page, limit);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  },

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const clientId = req.user!.id;
      const clientRole = req.user!.role as Role;
      const result = await createAppointmentUseCase.execute(
        clientId,
        clientRole,
        req.body as CreateAppointmentDtoType,
      );
      res.status(201).json({ data: result });
    } catch (error) {
      next(error);
    }
  },

  async updateStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const appointmentId = req.params['id'] as string;
      const userId = req.user!.id;
      const result = await updateAppointmentStatusUseCase.execute(
        appointmentId,
        userId,
        req.body as UpdateAppointmentDtoType,
      );
      res.status(200).json({ data: result });
    } catch (error) {
      next(error);
    }
  },

  async cancel(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const appointmentId = req.params['id'] as string;
      const userId = req.user!.id;
      const result = await cancelAppointmentUseCase.execute(appointmentId, userId);
      res.status(200).json({ data: result });
    } catch (error) {
      next(error);
    }
  },
};
