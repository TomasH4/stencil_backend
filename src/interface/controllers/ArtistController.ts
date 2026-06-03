// BE-72: ArtistController — CRUD for tattoo artist profiles

import { Request, Response, NextFunction } from 'express';
import { TattooArtistProfileRepository } from '../../infrastructure/repositories/TattooArtistProfileRepository';
import { GetArtistsUseCase } from '../../application/use-cases/artist/GetArtistsUseCase';
import { GetArtistByIdUseCase } from '../../application/use-cases/artist/GetArtistByIdUseCase';
import { CreateArtistProfileUseCase } from '../../application/use-cases/artist/CreateArtistProfileUseCase';
import { UpdateArtistProfileUseCase } from '../../application/use-cases/artist/UpdateArtistProfileUseCase';
import { DeleteArtistProfileUseCase } from '../../application/use-cases/artist/DeleteArtistProfileUseCase';
import { GetArtistsQueryDtoType } from '../../application/dtos/artist/GetArtistsQueryDto';
import { CreateArtistProfileDtoType } from '../../application/dtos/artist/CreateArtistProfileDto';
import { UpdateArtistProfileDtoType } from '../../application/dtos/artist/UpdateArtistProfileDto';
import { Role } from '../../domain/entities/User';

const artistRepo = new TattooArtistProfileRepository();
const getArtistsUseCase = new GetArtistsUseCase(artistRepo);
const getArtistByIdUseCase = new GetArtistByIdUseCase(artistRepo);
const createArtistProfileUseCase = new CreateArtistProfileUseCase(artistRepo);
const updateArtistProfileUseCase = new UpdateArtistProfileUseCase(artistRepo);
const deleteArtistProfileUseCase = new DeleteArtistProfileUseCase(artistRepo);

export const ArtistController = {
  async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await getArtistsUseCase.execute(req.query as unknown as GetArtistsQueryDtoType);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  },

  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await getArtistByIdUseCase.execute(req.params['id'] as string);
      res.status(200).json({ data: result });
    } catch (error) {
      next(error);
    }
  },

  async uploadAvatar(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const profileId = req.params['id'] as string;
      const userId = req.user!.id;

      if (!req.file) {
        res.status(400).json({ error: { message: 'La imagen es requerida' } });
        return;
      }

      // Verify ownership
      const profile = await artistRepo.findById(profileId);
      if (!profile) {
        res.status(404).json({ error: { message: 'Perfil no encontrado' } });
        return;
      }
      if (profile.userId !== userId) {
        res.status(403).json({ error: { message: 'No puedes modificar un perfil que no es tuyo' } });
        return;
      }

      // Upload to Supabase Storage
      const { supabase } = await import('../../infrastructure/storage/supabaseClient');
      const pathModule = await import('path');
      const fileExt = pathModule.extname(req.file.originalname);
      const fileName = `${Date.now()}-avatar${fileExt}`;
      const filePath = `avatars/${userId}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('portafolios')
        .upload(filePath, req.file.buffer, {
          contentType: req.file.mimetype,
          cacheControl: '3600',
          upsert: true
        });

      if (uploadError) {
        console.error('Supabase upload error:', uploadError);
        res.status(500).json({ error: { message: 'Error subiendo avatar a Supabase', details: uploadError.message } });
        return;
      }

      const { data: publicUrlData } = supabase.storage
        .from('portafolios')
        .getPublicUrl(filePath);

      const updatedProfile = await artistRepo.updateAvatar(profileId, publicUrlData.publicUrl);
      res.status(200).json({ data: updatedProfile });
    } catch (error) {
      next(error);
    }
  },

  async getMe(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const profile = await artistRepo.findByUserId(userId);
      if (!profile) {
        res.status(404).json({ error: { message: 'Perfil no encontrado' } });
        return;
      }
      res.status(200).json({ data: profile });
    } catch (error) {
      next(error);
    }
  },

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const userRole = req.user!.role as Role;
      const result = await createArtistProfileUseCase.execute(
        userId,
        userRole,
        req.body as CreateArtistProfileDtoType,
      );
      res.status(201).json({ data: result });
    } catch (error) {
      next(error);
    }
  },

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const profileId = req.params['id'] as string;
      const userId = req.user!.id;
      const result = await updateArtistProfileUseCase.execute(
        profileId,
        userId,
        req.body as UpdateArtistProfileDtoType,
      );
      res.status(200).json({ data: result });
    } catch (error) {
      next(error);
    }
  },

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const profileId = req.params['id'] as string;
      const userId = req.user!.id;
      await deleteArtistProfileUseCase.execute(profileId, userId);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  },
};
