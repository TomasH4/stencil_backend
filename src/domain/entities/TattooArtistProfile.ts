// BE-28: TattooArtistProfile entity — domain layer

export interface PortfolioImage {
  id: string;
  imageUrl: string;
  description?: string;
  createdAt: Date;
}

export interface TattooArtistProfile {
  id: string;
  userId: string;
  name?: string;
  bio: string;
  style: string;
  location: string;
  /** Stored as Decimal in DB, exposed as number in domain */
  priceMin: number;
  /** Stored as Decimal in DB, exposed as number in domain */
  priceMax: number;
  profilePictureUrl?: string;
  whatsappNumber?: string;
  instagramUrl?: string;
  portfolioImages?: PortfolioImage[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateArtistProfileData {
  userId: string;
  name?: string;
  bio: string;
  style: string;
  location: string;
  priceMin: number;
  priceMax: number;
  whatsappNumber?: string;
  instagramUrl?: string;
}

export interface UpdateArtistProfileData {
  name?: string;
  bio?: string;
  style?: string;
  location?: string;
  priceMin?: number;
  priceMax?: number;
  whatsappNumber?: string;
  instagramUrl?: string;
}

/** Filters used when listing artist profiles */
export interface ArtistFilters {
  style?: string;
  location?: string;
  priceMin?: number;
  priceMax?: number;
}
