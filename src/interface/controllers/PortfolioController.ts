import { Request, Response } from 'express';
import { prisma } from '../../infrastructure/database/prisma.client';
import { TattooArtistProfileRepository } from '../../infrastructure/repositories/TattooArtistProfileRepository';
import fs from 'fs';
import path from 'path';

const profileRepo = new TattooArtistProfileRepository();

export class PortfolioController {
  static async addImage(req: Request, res: Response) {
    try {
      const { id } = req.params as { id: string };
      const { description } = req.body;
      const userId = req.user!.id;

      if (!req.file) {
        return res.status(400).json({ error: { message: 'La imagen es requerida' } });
      }

      // The file path relative to the domain
      const imageUrl = `/uploads/${req.file.filename}`;

      // Verify the profile exists and belongs to the user
      const profile = await profileRepo.findById(id);
      if (!profile) {
        return res.status(404).json({ error: { message: 'Perfil de artista no encontrado' } });
      }
      if (profile.userId !== userId) {
        return res.status(403).json({ error: { message: 'No puedes modificar un portafolio que no es tuyo' } });
      }

      // Create the image
      const image = await prisma.portfolioImage.create({
        data: {
          artistProfileId: id,
          imageUrl,
          description
        }
      });

      return res.status(201).json({ data: image });
    } catch (error: any) {
      return res.status(500).json({ error: { message: 'Error al subir la imagen', details: error.message } });
    }
  }

  static async removeImage(req: Request, res: Response) {
    try {
      const { id, imageId } = req.params as { id: string; imageId: string };
      const userId = req.user!.id;

      // Verify the profile exists and belongs to the user
      const profile = await profileRepo.findById(id);
      if (!profile) {
        return res.status(404).json({ error: { message: 'Perfil de artista no encontrado' } });
      }
      if (profile.userId !== userId) {
        return res.status(403).json({ error: { message: 'No puedes modificar un portafolio que no es tuyo' } });
      }

      // Verify image exists
      const image = await prisma.portfolioImage.findUnique({ where: { id: imageId } });
      if (!image || image.artistProfileId !== id) {
        return res.status(404).json({ error: { message: 'Imagen no encontrada en tu portafolio' } });
      }

      // Delete the image from database
      await prisma.portfolioImage.delete({ where: { id: imageId } });

      // Delete file from filesystem
      if (image.imageUrl && image.imageUrl.startsWith('/uploads/')) {
        const filename = image.imageUrl.replace('/uploads/', '');
        const filepath = path.join(process.cwd(), 'uploads', filename);
        if (fs.existsSync(filepath)) {
          fs.unlinkSync(filepath);
        }
      }

      return res.status(204).send();
    } catch (error: any) {
      return res.status(500).json({ error: { message: 'Error al eliminar la imagen', details: error.message } });
    }
  }
}
