// BE-55: CreateArtistProfileUseCase — create a profile for a TATTOO_ARTIST user

import { ITattooArtistProfileRepository } from '../../../domain/repositories/ITattooArtistProfileRepository';
import { TattooArtistProfile } from '../../../domain/entities/TattooArtistProfile';
import { CreateArtistProfileDtoType } from '../../dtos/artist/CreateArtistProfileDto';
import { AppError } from '../../../shared/errors/AppError';
import { Role } from '../../../domain/entities/User';

export class CreateArtistProfileUseCase {
  constructor(private readonly artistRepo: ITattooArtistProfileRepository) {}

  async execute(
    userId: string,
    userRole: Role,
    dto: CreateArtistProfileDtoType,
  ): Promise<TattooArtistProfile> {
    // Only TATTOO_ARTIST users can create a profile
    if (userRole !== Role.TATTOO_ARTIST) {
      throw new AppError('Only tattoo artists can create a profile', 403);
    }

    // Each user can only have one profile
    const existing = await this.artistRepo.findByUserId(userId);
    if (existing) {
      throw new AppError('Artist profile already exists for this user', 409);
    }

    return this.artistRepo.create({ ...dto, userId });
  }
}
