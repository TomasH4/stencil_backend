import { prisma } from '../database/prisma.client';
import { TattooArtistProfile } from '../../domain/entities/TattooArtistProfile';
import { TattooArtistProfileRepository } from './TattooArtistProfileRepository';

const profileRepo = new TattooArtistProfileRepository();

export class FavoriteRepository {
  async toggleFavorite(clientId: string, artistProfileId: string): Promise<boolean> {
    const existing = await prisma.favorite.findUnique({
      where: {
        clientId_artistProfileId: {
          clientId,
          artistProfileId,
        },
      },
    });

    if (existing) {
      await prisma.favorite.delete({
        where: { id: existing.id },
      });
      return false; // Removed
    } else {
      await prisma.favorite.create({
        data: {
          clientId,
          artistProfileId,
        },
      });
      return true; // Added
    }
  }

  async findByClientId(clientId: string): Promise<TattooArtistProfile[]> {
    const favorites = await prisma.favorite.findMany({
      where: { clientId },
      include: {
        artistProfile: {
          include: { portfolioImages: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    // Map using the existing profile repo's mapToEntity logic, but since it's private, we will just map it manually
    return favorites.map(f => ({
      id: f.artistProfile.id,
      userId: f.artistProfile.userId,
      name: f.artistProfile.name || undefined,
      bio: f.artistProfile.bio,
      style: f.artistProfile.style,
      location: f.artistProfile.location,
      priceMin: f.artistProfile.priceMin.toNumber(),
      priceMax: f.artistProfile.priceMax.toNumber(),
      profilePictureUrl: f.artistProfile.profilePictureUrl || undefined,
      whatsappNumber: f.artistProfile.whatsappNumber || undefined,
      instagramUrl: f.artistProfile.instagramUrl || undefined,
      portfolioImages: f.artistProfile.portfolioImages?.map(img => ({
        id: img.id,
        imageUrl: img.imageUrl,
        description: img.description || undefined,
        createdAt: img.createdAt,
      })) || [],
      createdAt: f.artistProfile.createdAt,
      updatedAt: f.artistProfile.updatedAt,
    }));
  }
}
