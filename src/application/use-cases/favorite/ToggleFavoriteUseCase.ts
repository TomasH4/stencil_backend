import { FavoriteRepository } from '../../../infrastructure/repositories/FavoriteRepository';
import { TattooArtistProfileRepository } from '../../../infrastructure/repositories/TattooArtistProfileRepository';
import { AppError } from '../../../shared/errors/AppError';

export class ToggleFavoriteUseCase {
  constructor(
    private favoriteRepo: FavoriteRepository,
    private artistRepo: TattooArtistProfileRepository
  ) {}

  async execute(clientId: string, artistProfileId: string): Promise<{ isFavorite: boolean }> {
    const artist = await this.artistRepo.findById(artistProfileId);
    if (!artist) {
      throw new AppError('Artist profile not found', 404);
    }

    const isFavorite = await this.favoriteRepo.toggleFavorite(clientId, artistProfileId);
    return { isFavorite };
  }
}
