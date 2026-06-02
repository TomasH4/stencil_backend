// BE-65: CancelAppointmentUseCase — CLIENT cancels their own appointment

import { IAppointmentRepository } from '../../../domain/repositories/IAppointmentRepository';
import { Appointment, AppointmentStatus } from '../../../domain/entities/Appointment';
import { AppError } from '../../../shared/errors/AppError';

export class CancelAppointmentUseCase {
  constructor(private readonly appointmentRepo: IAppointmentRepository) {}

  async execute(appointmentId: string, userId: string): Promise<Appointment> {
    const appointment = await this.appointmentRepo.findById(appointmentId);
    if (!appointment) {
      throw new AppError('Appointment not found', 404);
    }

    // Only the client who booked can cancel
    if (appointment.clientId !== userId) {
      throw new AppError('You do not have permission to cancel this appointment', 403);
    }

    return this.appointmentRepo.update(appointmentId, {
      status: AppointmentStatus.CANCELLED,
    });
  }
}
