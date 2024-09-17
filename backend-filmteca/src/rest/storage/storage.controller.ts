import {
  BadRequestException,
  Controller,
  Logger,
  Param,
  Post,
  Delete,
  UploadedFile,
  UseInterceptors,
  Req,
} from '@nestjs/common';
import { StorageService } from './storage.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request } from 'express';
import { ApiTags } from '@nestjs/swagger';

@Controller('storage')
@ApiTags('Storage')
export class StorageController {
  private readonly logger = new Logger(StorageController.name);

  constructor(private readonly storageService: StorageService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Req() req: Request,
  ) {
    this.logger.log(`Subiendo archivo: ${file.originalname}`);

    if (!file) {
      throw new BadRequestException('Fichero no encontrado.');
    }

    try {
      const result = await this.storageService.uploadFile(file);
      return {
        originalname: file.originalname,
        url: result.secure_url, // URL pública del archivo en Cloudinary
        public_id: result.public_id, // ID público para eliminar o gestionar el archivo
      };
    } catch (error) {
      throw new BadRequestException('Error al subir el archivo.');
    }
  }

  @Delete(':publicId')
  async deleteFile(@Param('publicId') publicId: string) {
    this.logger.log(`Eliminando archivo con public_id: ${publicId}`);

    try {
      await this.storageService.deleteFile(publicId);
      return { message: 'Archivo eliminado exitosamente.' };
    } catch (error) {
      throw new BadRequestException('Error al eliminar el archivo.');
    }
  }
}
