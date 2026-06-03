// BE-76: artistRouter — /api/v1/artists routes

import { Router } from 'express';
import { ArtistController } from '../controllers/ArtistController';
import { authenticate } from '../middlewares/authenticate';
import { authorize } from '../middlewares/authorize';
import { validateBody } from '../middlewares/validateBody';
import { PortfolioController } from '../controllers/PortfolioController';
import { validateQuery } from '../middlewares/validateQuery';
import { CreateArtistProfileDto } from '../../application/dtos/artist/CreateArtistProfileDto';
import { UpdateArtistProfileDto } from '../../application/dtos/artist/UpdateArtistProfileDto';
import { GetArtistsQueryDto } from '../../application/dtos/artist/GetArtistsQueryDto';
import { AddPortfolioImageDto } from '../../application/dtos/artist/AddPortfolioImageDto';
import { upload } from '../../infrastructure/middlewares/upload.middleware';

export const artistRouter = Router();

// GET /api/v1/artists — public, filterable and paginated
artistRouter.get('/', validateQuery(GetArtistsQueryDto), ArtistController.getAll);

// GET /api/v1/artists/me — TATTOO_ARTIST only
artistRouter.get('/me', authenticate, authorize('TATTOO_ARTIST'), ArtistController.getMe);

// GET /api/v1/artists/:id — public
artistRouter.get('/:id', ArtistController.getById);

// POST /api/v1/artists — TATTOO_ARTIST only
artistRouter.post(
  '/',
  authenticate,
  authorize('TATTOO_ARTIST'),
  validateBody(CreateArtistProfileDto),
  ArtistController.create,
);

// PUT /api/v1/artists/:id — TATTOO_ARTIST only (owner)
artistRouter.put(
  '/:id',
  authenticate,
  authorize('TATTOO_ARTIST'),
  validateBody(UpdateArtistProfileDto),
  ArtistController.update,
);

// DELETE /api/v1/artists/:id — TATTOO_ARTIST only (owner)
artistRouter.delete('/:id', authenticate, authorize('TATTOO_ARTIST'), ArtistController.delete);

// POST /api/v1/artists/:id/portfolio — TATTOO_ARTIST only (owner)
artistRouter.post(
  '/:id/portfolio',
  authenticate,
  authorize('TATTOO_ARTIST'),
  upload.single('image'),
  validateBody(AddPortfolioImageDto),
  PortfolioController.addImage,
);

// DELETE /api/v1/artists/:id/portfolio/:imageId — TATTOO_ARTIST only (owner)
artistRouter.delete(
  '/:id/portfolio/:imageId',
  authenticate,
  authorize('TATTOO_ARTIST'),
  PortfolioController.removeImage,
);
