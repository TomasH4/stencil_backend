// BE-36: Shared types — PaginatedResponse, ApiResponse, re-exports of domain enums

export { Role } from '../../domain/entities/User';
export { AppointmentStatus } from '../../domain/entities/Appointment';

/** Standard paginated list response */
export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
  };
}

/** Standard single-item or action response */
export interface ApiResponse<T> {
  data: T;
}

/** Standard error response shape */
export interface ApiErrorResponse {
  error: {
    message: string;
    statusCode: number;
  };
}
