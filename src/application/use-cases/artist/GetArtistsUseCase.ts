// BE-53: GetArtistsUseCase — list artist profiles with filters and pagination

import { ITattooArtistProfileRepository, PaginatedResult } from '../../../domain/repositories/ITattooArtistProfileRepository';
import { TattooArtistProfile } from '../../../domain/entities/TattooArtistProfile';
import { GetArtistsQueryDtoType } from '../../dtos/artist/GetArtistsQueryDto';

export class GetArtistsUseCase {
  constructor(private readonly artistRepo: ITattooArtistProfileRepository) {}

  async execute(
    query: GetArtistsQueryDtoType,
  ): Promise<PaginatedResult<TattooArtistProfile>> {
    return this.artistRepo.findAll(
      {
        style: query.style,
        location: query.location,
        priceMin: query.priceMin,
        priceMax: query.priceMax,
      },
      { page: query.page, limit: query.limit },
    );
  }
}
