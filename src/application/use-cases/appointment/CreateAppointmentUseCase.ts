// BE-63: CreateAppointmentUseCase — CLIENT books an appointment with an artist

import { IAppointmentRepository } from '../../../domain/repositories/IAppointmentRepository';
import { Appointment } from '../../../domain/entities/Appointment';
import { CreateAppointmentDtoType } from '../../dtos/appointment/CreateAppointmentDto';
import { AppError } from '../../../shared/errors/AppError';
import { Role } from '../../../domain/entities/User';

export class CreateAppointmentUseCase {
  constructor(private readonly appointmentRepo: IAppointmentRepository) {}

  async execute(
    clientId: string,
    clientRole: Role,
    dto: CreateAppointmentDtoType,
  ): Promise<Appointment> {
    if (clientRole !== Role.CLIENT) {
      throw new AppError('Only clients can book appointments', 403);
    }

    return this.appointmentRepo.create({
      clientId,
      artistProfileId: dto.artistProfileId,
      date: dto.date,
      notes: dto.notes,
    });
  }
}
