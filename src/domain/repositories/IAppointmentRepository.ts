// BE-34: IAppointmentRepository — domain layer interface

import { Appointment, CreateAppointmentData, UpdateAppointmentData } from '../entities/Appointment';
import { PaginationParams, PaginatedResult } from './ITattooArtistProfileRepository';

export interface IAppointmentRepository {
  /**
   * Find all appointments where the user is the client.
   */
  findAllByClientId(
    clientId: string,
    pagination: PaginationParams,
  ): Promise<PaginatedResult<Appointment>>;

  /**
   * Find all appointments for a given artist profile.
   */
  findAllByArtistId(
    artistProfileId: string,
    pagination: PaginationParams,
  ): Promise<PaginatedResult<Appointment>>;

  /**
   * Find a single appointment by ID.
   * Returns null if not found.
   */
  findById(id: string): Promise<Appointment | null>;

  /**
   * Create and persist a new appointment.
   */
  create(data: CreateAppointmentData): Promise<Appointment>;

  /**
   * Update an existing appointment (status, notes).
   */
  update(id: string, data: UpdateAppointmentData): Promise<Appointment>;
}
