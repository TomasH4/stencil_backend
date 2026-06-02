// BE-61: GetClientAppointmentsUseCase — list all appointments for the authenticated client

import { IAppointmentRepository } from '../../../domain/repositories/IAppointmentRepository';
import { Appointment } from '../../../domain/entities/Appointment';
import { PaginatedResult } from '../../../domain/repositories/ITattooArtistProfileRepository';

export class GetClientAppointmentsUseCase {
  constructor(private readonly appointmentRepo: IAppointmentRepository) {}

  async execute(
    clientId: string,
    page: number,
    limit: number,
  ): Promise<PaginatedResult<Appointment>> {
    return this.appointmentRepo.findAllByClientId(clientId, { page, limit });
  }
}
