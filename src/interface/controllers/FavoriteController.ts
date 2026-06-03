import { Request, Response, NextFunction } from 'express';
import { FavoriteRepository } from '../../infrastructure/repositories/FavoriteRepository';
import { TattooArtistProfileRepository } from '../../infrastructure/repositories/TattooArtistProfileRepository';
import { ToggleFavoriteUseCase } from '../../application/use-cases/favorite/ToggleFavoriteUseCase';
import { GetClientFavoritesUseCase } from '../../application/use-cases/favorite/GetClientFavoritesUseCase';

const favoriteRepo = new FavoriteRepository();
const artistRepo = new TattooArtistProfileRepository();
const toggleFavoriteUseCase = new ToggleFavoriteUseCase(favoriteRepo, artistRepo);
const getClientFavoritesUseCase = new GetClientFavoritesUseCase(favoriteRepo);

export const FavoriteController = {
  async toggle(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { artistProfileId } = req.body;
      const clientId = req.user!.id;
      const result = await toggleFavoriteUseCase.execute(clientId, artistProfileId);
      res.status(200).json({ data: result });
    } catch (error) {
      next(error);
    }
  },

  async getMyFavorites(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const clientId = req.user!.id;
      const result = await getClientFavoritesUseCase.execute(clientId);
      res.status(200).json({ data: result });
    } catch (error) {
      next(error);
    }
  }
};
