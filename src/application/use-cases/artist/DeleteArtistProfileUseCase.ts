// BE-57: DeleteArtistProfileUseCase — delete own artist profile

import { ITattooArtistProfileRepository } from '../../../domain/repositories/ITattooArtistProfileRepository';
import { AppError } from '../../../shared/errors/AppError';

export class DeleteArtistProfileUseCase {
  constructor(private readonly artistRepo: ITattooArtistProfileRepository) {}

  async execute(profileId: string, userId: string): Promise<void> {
    const profile = await this.artistRepo.findById(profileId);
    if (!profile) {
      throw new AppError('Artist profile not found', 404);
    }

    // Only the owner can delete their profile
    if (profile.userId !== userId) {
      throw new AppError('You do not have permission to delete this profile', 403);
    }

    await this.artistRepo.delete(profileId);
  }
}
