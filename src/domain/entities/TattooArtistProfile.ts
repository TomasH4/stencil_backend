// BE-28: TattooArtistProfile entity — domain layer

export interface TattooArtistProfile {
  id: string;
  userId: string;
  bio: string;
  style: string;
  location: string;
  /** Stored as Decimal in DB, exposed as number in domain */
  priceMin: number;
  /** Stored as Decimal in DB, exposed as number in domain */
  priceMax: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateArtistProfileData {
  userId: string;
  bio: string;
  style: string;
  location: string;
  priceMin: number;
  priceMax: number;
}

export type UpdateArtistProfileData = Partial<Omit<CreateArtistProfileData, 'userId'>>;

/** Filters used when listing artist profiles */
export interface ArtistFilters {
  style?: string;
  location?: string;
  priceMin?: number;
  priceMax?: number;
}
