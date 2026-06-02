// BE-42: AppointmentRepository — Prisma implementation of IAppointmentRepository

import { prisma } from '../database/prisma.client';
import { IAppointmentRepository } from '../../domain/repositories/IAppointmentRepository';
import {
  Appointment,
  AppointmentStatus,
  CreateAppointmentData,
  UpdateAppointmentData,
} from '../../domain/entities/Appointment';
import { PaginatedResult, PaginationParams } from '../../domain/repositories/ITattooArtistProfileRepository';
import { getPagination } from '../../shared/utils/paginate';

export class AppointmentRepository implements IAppointmentRepository {
  async findAllByClientId(
    clientId: string,
    pagination: PaginationParams,
  ): Promise<PaginatedResult<Appointment>> {
    const { skip, take } = getPagination(pagination.page, pagination.limit);

    const [items, total] = await Promise.all([
      prisma.appointment.findMany({
        where: { clientId },
        skip,
        take,
        orderBy: { date: 'asc' },
        include: {
          artistProfile: { select: { id: true, style: true, location: true } },
        },
      }),
      prisma.appointment.count({ where: { clientId } }),
    ]);

    return {
      data: items.map((a: typeof items[number]) => this.mapToEntity(a)),
      meta: { page: pagination.page, limit: pagination.limit, total },
    };
  }

  async findAllByArtistId(
    artistProfileId: string,
    pagination: PaginationParams,
  ): Promise<PaginatedResult<Appointment>> {
    const { skip, take } = getPagination(pagination.page, pagination.limit);

    const [items, total] = await Promise.all([
      prisma.appointment.findMany({
        where: { artistProfileId },
        skip,
        take,
        orderBy: { date: 'asc' },
        include: {
          client: { select: { id: true, email: true } },
        },
      }),
      prisma.appointment.count({ where: { artistProfileId } }),
    ]);

    return {
      data: items.map((a: typeof items[number]) => this.mapToEntity(a)),
      meta: { page: pagination.page, limit: pagination.limit, total },
    };
  }

  async findById(id: string): Promise<Appointment | null> {
    const appointment = await prisma.appointment.findUnique({ where: { id } });
    if (!appointment) return null;
    return this.mapToEntity(appointment);
  }

  async create(data: CreateAppointmentData): Promise<Appointment> {
    const appointment = await prisma.appointment.create({
      data: {
        clientId: data.clientId,
        artistProfileId: data.artistProfileId,
        date: data.date,
        notes: data.notes,
        status: 'PENDING',
      },
    });
    return this.mapToEntity(appointment);
  }

  async update(id: string, data: UpdateAppointmentData): Promise<Appointment> {
    const appointment = await prisma.appointment.update({
      where: { id },
      data: {
        status: data.status,
        ...(data.notes !== undefined && { notes: data.notes }),
      },
    });
    return this.mapToEntity(appointment);
  }

  private mapToEntity(raw: {
    id: string;
    clientId: string;
    artistProfileId: string;
    date: Date;
    status: string;
    notes?: string | null;
    createdAt: Date;
  }): Appointment {
    return {
      id: raw.id,
      clientId: raw.clientId,
      artistProfileId: raw.artistProfileId,
      date: raw.date,
      status: raw.status as AppointmentStatus,
      notes: raw.notes ?? null,
      createdAt: raw.createdAt,
    };
  }
}
