// BE-54: GetArtistByIdUseCase — fetch a single artist profile

import { ITattooArtistProfileRepository } from '../../../domain/repositories/ITattooArtistProfileRepository';
import { TattooArtistProfile } from '../../../domain/entities/TattooArtistProfile';
import { AppError } from '../../../shared/errors/AppError';

export class GetArtistByIdUseCase {
  constructor(private readonly artistRepo: ITattooArtistProfileRepository) {}

  async execute(id: string): Promise<TattooArtistProfile> {
    const profile = await this.artistRepo.findById(id);
    if (!profile) {
      throw new AppError('Artist profile not found', 404);
    }
    return profile;
  }
}
