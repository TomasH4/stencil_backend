// BE-56: UpdateArtistProfileUseCase — update own artist profile

import { ITattooArtistProfileRepository } from '../../../domain/repositories/ITattooArtistProfileRepository';
import { TattooArtistProfile } from '../../../domain/entities/TattooArtistProfile';
import { UpdateArtistProfileDtoType } from '../../dtos/artist/UpdateArtistProfileDto';
import { AppError } from '../../../shared/errors/AppError';

export class UpdateArtistProfileUseCase {
  constructor(private readonly artistRepo: ITattooArtistProfileRepository) {}

  async execute(
    profileId: string,
    userId: string,
    dto: UpdateArtistProfileDtoType,
  ): Promise<TattooArtistProfile> {
    const profile = await this.artistRepo.findById(profileId);
    if (!profile) {
      throw new AppError('Artist profile not found', 404);
    }

    // Only the owner can update their profile
    if (profile.userId !== userId) {
      throw new AppError('You do not have permission to update this profile', 403);
    }

    return this.artistRepo.update(profileId, dto);
  }
}
