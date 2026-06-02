// BE-32: ITattooArtistProfileRepository — domain layer interface

import {
  TattooArtistProfile,
  CreateArtistProfileData,
  UpdateArtistProfileData,
  ArtistFilters,
} from '../entities/TattooArtistProfile';

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginatedResult<T> {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
  };
}

export interface ITattooArtistProfileRepository {
  /**
   * Find a profile by its unique ID.
   * Returns null if not found.
   */
  findById(id: string): Promise<TattooArtistProfile | null>;

  /**
   * Find all profiles with optional filters and pagination.
   */
  findAll(
    filters: ArtistFilters,
    pagination: PaginationParams,
  ): Promise<PaginatedResult<TattooArtistProfile>>;

  /**
   * Find the profile that belongs to a specific user ID.
   * Returns null if the user has no profile.
   */
  findByUserId(userId: string): Promise<TattooArtistProfile | null>;

  /**
   * Create and persist a new artist profile.
   */
  create(data: CreateArtistProfileData): Promise<TattooArtistProfile>;

  /**
   * Update an existing profile by ID.
   */
  update(id: string, data: UpdateArtistProfileData): Promise<TattooArtistProfile>;

  /**
   * Delete a profile by ID.
   */
  delete(id: string): Promise<void>;
}
