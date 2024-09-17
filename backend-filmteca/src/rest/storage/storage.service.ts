import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import * as cloudinary from 'cloudinary';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class StorageService {
  private readonly logger = new Logger(StorageService.name);

  constructor(private readonly configService: ConfigService) {
    cloudinary.v2.config({
      cloud_name: this.configService.get<string>('CLOUDINARY_CLOUD_NAME'),
      api_key: this.configService.get<string>('CLOUDINARY_API_KEY'),
      api_secret: this.configService.get<string>('CLOUDINARY_API_SECRET'),
    });
  }

  async uploadFile(file: Express.Multer.File): Promise<any> {
    this.logger.log(`Subiendo archivo: ${file.originalname}`);

    return new Promise((resolve, reject) => {
      cloudinary.v2.uploader
        .upload_stream({ resource_type: 'auto' }, (error, result) => {
          if (error) {
            this.logger.error(
              `Error al subir archivo a Cloudinary: ${error.message}`,
            );
            reject(error);
          } else {
            this.logger.log(
              `Archivo subido exitosamente a Cloudinary: ${result.url}`,
            );
            resolve(result);
          }
        })
        .end(file.buffer);
    });
  }

  async deleteFile(publicId: string): Promise<void> {
    this.logger.log(`Eliminando archivo con public_id: ${publicId}`);

    return new Promise((resolve, reject) => {
      cloudinary.v2.uploader.destroy(publicId, (error, result) => {
        if (error) {
          this.logger.error(
            `Error al eliminar archivo de Cloudinary: ${error.message}`,
          );
          reject(error);
        } else if (result.result === 'ok') {
          this.logger.log(`Archivo eliminado exitosamente de Cloudinary`);
          resolve();
        } else {
          reject(
            new NotFoundException(
              `El archivo con public_id ${publicId} no se encontró.`,
            ),
          );
        }
      });
    });
  }
}
