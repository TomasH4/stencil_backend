import { FavoriteRepository } from '../../../infrastructure/repositories/FavoriteRepository';
import { TattooArtistProfile } from '../../../domain/entities/TattooArtistProfile';

export class GetClientFavoritesUseCase {
  constructor(private favoriteRepo: FavoriteRepository) {}

  async execute(clientId: string): Promise<TattooArtistProfile[]> {
    return this.favoriteRepo.findByClientId(clientId);
  }
}
