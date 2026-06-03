import { Request, Response } from 'express';
import { prisma } from '../../infrastructure/database/prisma.client';
import { TattooArtistProfileRepository } from '../../infrastructure/repositories/TattooArtistProfileRepository';
import { supabase } from '../../infrastructure/storage/supabaseClient';
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

      // Verify the profile exists and belongs to the user
      const profile = await profileRepo.findById(id);
      if (!profile) {
        return res.status(404).json({ error: { message: 'Perfil de artista no encontrado' } });
      }
      if (profile.userId !== userId) {
        return res.status(403).json({ error: { message: 'No puedes modificar un portafolio que no es tuyo' } });
      }

      // Upload to Supabase Storage
      const fileExt = path.extname(req.file.originalname);
      const fileName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${fileExt}`;
      const filePath = `portfolios/${userId}/${fileName}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('portafolios')
        .upload(filePath, req.file.buffer, {
          contentType: req.file.mimetype,
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error('Supabase upload error:', uploadError);
        return res.status(500).json({ 
          error: { 
            message: 'Error subiendo a Supabase Storage', 
            details: uploadError.message,
            statusCode: (uploadError as any).statusCode
          } 
        });
      }

      // Get public URL
      const { data: publicUrlData } = supabase.storage
        .from('portafolios')
        .getPublicUrl(filePath);

      const imageUrl = publicUrlData.publicUrl;

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

      // Delete file from Supabase
      if (image.imageUrl && image.imageUrl.includes('supabase.co')) {
        // Extract the file path from the public URL
        // URL format: https://.../storage/v1/object/public/portafolios/portfolios/userId/filename.ext
        const urlParts = image.imageUrl.split('/portafolios/');
        if (urlParts.length > 1) {
          const filePath = urlParts[1];
          await supabase.storage.from('portafolios').remove([filePath]);
        }
      }

      return res.status(204).send();
    } catch (error: any) {
      return res.status(500).json({ error: { message: 'Error al eliminar la imagen', details: error.message } });
    }
  }
}
