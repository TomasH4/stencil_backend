// BE-64: UpdateAppointmentStatusUseCase — artist or client updates appointment status

import { IAppointmentRepository } from '../../../domain/repositories/IAppointmentRepository';
import { ITattooArtistProfileRepository } from '../../../domain/repositories/ITattooArtistProfileRepository';
import { Appointment } from '../../../domain/entities/Appointment';
import { UpdateAppointmentDtoType } from '../../dtos/appointment/UpdateAppointmentDto';
import { AppError } from '../../../shared/errors/AppError';
import { AppointmentStatus } from '../../../domain/entities/Appointment';

export class UpdateAppointmentStatusUseCase {
  constructor(
    private readonly appointmentRepo: IAppointmentRepository,
    private readonly artistRepo: ITattooArtistProfileRepository,
  ) {}

  async execute(
    appointmentId: string,
    userId: string,
    dto: UpdateAppointmentDtoType,
  ): Promise<Appointment> {
    const appointment = await this.appointmentRepo.findById(appointmentId);
    if (!appointment) {
      throw new AppError('Appointment not found', 404);
    }

    // Check if user is the client
    const isClient = appointment.clientId === userId;

    // Check if user is the artist who owns this appointment's profile
    const artistProfile = await this.artistRepo.findByUserId(userId);
    const isArtist = artistProfile !== null && artistProfile.id === appointment.artistProfileId;

    if (!isClient && !isArtist) {
      throw new AppError('You do not have permission to update this appointment', 403);
    }

    return this.appointmentRepo.update(appointmentId, {
      status: dto.status as AppointmentStatus,
    });
  }
}
