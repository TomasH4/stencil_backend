// BE-30: Appointment entity — domain layer

export enum AppointmentStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED',
}

export interface Appointment {
  id: string;
  clientId: string;
  artistProfileId: string;
  date: Date;
  status: AppointmentStatus;
  notes?: string | null;
  createdAt: Date;
  clientName?: string;
  artistName?: string;
}

export interface CreateAppointmentData {
  clientId: string;
  artistProfileId: string;
  date: Date;
  notes?: string;
}

export interface UpdateAppointmentData {
  status: AppointmentStatus;
  notes?: string;
}
