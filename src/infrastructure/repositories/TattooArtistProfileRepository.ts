// BE-40: TattooArtistProfileRepository — Prisma implementation

import { Prisma } from '@prisma/client';
import { prisma } from '../database/prisma.client';
import { ITattooArtistProfileRepository, PaginatedResult, PaginationParams } from '../../domain/repositories/ITattooArtistProfileRepository';
import {
  TattooArtistProfile,
  CreateArtistProfileData,
  UpdateArtistProfileData,
  ArtistFilters,
} from '../../domain/entities/TattooArtistProfile';
import { getPagination } from '../../shared/utils/paginate';

export class TattooArtistProfileRepository
  implements ITattooArtistProfileRepository
{
  async findById(id: string): Promise<TattooArtistProfile | null> {
    const profile = await prisma.tattooArtistProfile.findUnique({ 
      where: { id },
      include: { portfolioImages: true }
    });
    if (!profile) return null;
    return this.mapToEntity(profile);
  }

  async findAll(
    filters: ArtistFilters,
    pagination: PaginationParams,
  ): Promise<PaginatedResult<TattooArtistProfile>> {
    const { skip, take } = getPagination(pagination.page, pagination.limit);

    const where: Prisma.TattooArtistProfileWhereInput = {};

    if (filters.style) {
      where.style = { contains: filters.style, mode: 'insensitive' };
    }
    if (filters.location) {
      where.location = { contains: filters.location, mode: 'insensitive' };
    }
    if (filters.priceMin !== undefined) {
      where.priceMin = { gte: new Prisma.Decimal(filters.priceMin) };
    }
    if (filters.priceMax !== undefined) {
      where.priceMax = { lte: new Prisma.Decimal(filters.priceMax) };
    }

    const [items, total] = await Promise.all([
      prisma.tattooArtistProfile.findMany({ where, skip, take, orderBy: { createdAt: 'desc' } }),
      prisma.tattooArtistProfile.count({ where }),
    ]);

    return {
      data: items.map((p: typeof items[number]) => this.mapToEntity(p)),
      meta: { page: pagination.page, limit: pagination.limit, total },
    };
  }

  async findByUserId(userId: string): Promise<TattooArtistProfile | null> {
    const profile = await prisma.tattooArtistProfile.findUnique({ 
      where: { userId },
      include: { portfolioImages: true }
    });
    if (!profile) return null;
    return this.mapToEntity(profile);
  }

  async create(data: CreateArtistProfileData): Promise<TattooArtistProfile> {
    const profile = await prisma.tattooArtistProfile.create({
      data: {
        userId: data.userId,
        name: data.name,
        bio: data.bio,
        style: data.style,
        location: data.location,
        priceMin: new Prisma.Decimal(data.priceMin),
        priceMax: new Prisma.Decimal(data.priceMax),
        whatsappNumber: data.whatsappNumber,
        instagramUrl: data.instagramUrl,
      },
    });
    return this.mapToEntity(profile);
  }

  async update(
    id: string,
    data: UpdateArtistProfileData,
  ): Promise<TattooArtistProfile> {
    const updateData: Prisma.TattooArtistProfileUpdateInput = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.bio !== undefined) updateData.bio = data.bio;
    if (data.style !== undefined) updateData.style = data.style;
    if (data.location !== undefined) updateData.location = data.location;
    if (data.priceMin !== undefined)
      updateData.priceMin = new Prisma.Decimal(data.priceMin);
    if (data.priceMax !== undefined)
      updateData.priceMax = new Prisma.Decimal(data.priceMax);
    if (data.whatsappNumber !== undefined) updateData.whatsappNumber = data.whatsappNumber;
    if (data.instagramUrl !== undefined) updateData.instagramUrl = data.instagramUrl;

    const profile = await prisma.tattooArtistProfile.update({
      where: { id },
      data: updateData,
    });
    return this.mapToEntity(profile);
  }

  async updateAvatar(id: string, profilePictureUrl: string): Promise<TattooArtistProfile> {
    const profile = await prisma.tattooArtistProfile.update({
      where: { id },
      data: { profilePictureUrl },
    });
    return this.mapToEntity(profile);
  }

  async delete(id: string): Promise<void> {
    await prisma.tattooArtistProfile.delete({ where: { id } });
  }

  private mapToEntity(raw: {
    id: string;
    userId: string;
    name: string | null;
    bio: string;
    style: string;
    location: string;
    priceMin: Prisma.Decimal;
    priceMax: Prisma.Decimal;
    profilePictureUrl: string | null;
    whatsappNumber: string | null;
    instagramUrl: string | null;
    portfolioImages?: { id: string; imageUrl: string; description: string | null; createdAt: Date }[];
    createdAt: Date;
    updatedAt: Date;
  }): TattooArtistProfile {
    return {
      id: raw.id,
      userId: raw.userId,
      name: raw.name || undefined,
      bio: raw.bio,
      style: raw.style,
      location: raw.location,
      priceMin: raw.priceMin.toNumber(),
      priceMax: raw.priceMax.toNumber(),
      profilePictureUrl: raw.profilePictureUrl || undefined,
      whatsappNumber: raw.whatsappNumber || undefined,
      instagramUrl: raw.instagramUrl || undefined,
      portfolioImages: raw.portfolioImages?.map(img => ({
        id: img.id,
        imageUrl: img.imageUrl,
        description: img.description || undefined,
        createdAt: img.createdAt,
      })) || [],
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    };
  }
}
