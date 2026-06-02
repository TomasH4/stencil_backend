// BE-62: GetArtistAppointmentsUseCase — list appointments for the authenticated artist

import { IAppointmentRepository } from '../../../domain/repositories/IAppointmentRepository';
import { ITattooArtistProfileRepository } from '../../../domain/repositories/ITattooArtistProfileRepository';
import { Appointment } from '../../../domain/entities/Appointment';
import { PaginatedResult } from '../../../domain/repositories/ITattooArtistProfileRepository';
import { AppError } from '../../../shared/errors/AppError';

export class GetArtistAppointmentsUseCase {
  constructor(
    private readonly artistRepo: ITattooArtistProfileRepository,
    private readonly appointmentRepo: IAppointmentRepository,
  ) {}

  async execute(
    userId: string,
    page: number,
    limit: number,
  ): Promise<PaginatedResult<Appointment>> {
    // Look up the artist profile by the authenticated user's ID
    const profile = await this.artistRepo.findByUserId(userId);
    if (!profile) {
      throw new AppError('Artist profile not found for this user', 404);
    }

    return this.appointmentRepo.findAllByArtistId(profile.id, { page, limit });
  }
}
