import { CreateValoracionDto } from '../dto/create-valoracion.dto';
import { Pelicula } from '../../peliculas/entities/pelicula.entity';
import { Usuario } from '../../users/entities/user.entity';
import { Valoracion } from '../entities/valoracion.entity';
import { UpdateValoracionDto } from '../dto/update-valoracion.dto';

export class ValoracionMapper {
  // Mapeador para crear una nueva valoración desde el DTO
  static toEntity(
    createValoracionDto: CreateValoracionDto,
    pelicula: Pelicula,
    user: Usuario,
  ): Valoracion {
    const valoracion = new Valoracion();

    valoracion.review = createValoracionDto.review || null;
    valoracion.rating = createValoracionDto.rating;
    valoracion.pelicula = pelicula;
    valoracion.user = user;
    valoracion.createdAt = new Date();
    valoracion.updatedAt = new Date();
    valoracion.deletedAt = null;

    return valoracion;
  }

  // Mapeador para actualizar una valoración existente desde el DTO
  static updateToEntity(
    updateValoracionDto: UpdateValoracionDto,
    valoracion: Valoracion,
    pelicula?: Pelicula,
  ): Valoracion {
    if (updateValoracionDto.review) {
      valoracion.review = updateValoracionDto.review;
    }

    if (updateValoracionDto.rating) {
      valoracion.rating = updateValoracionDto.rating;
    }

    if (pelicula) {
      valoracion.pelicula = pelicula;
    }

    if (updateValoracionDto.deleted_at !== undefined) {
      valoracion.deletedAt = updateValoracionDto.deleted_at
        ? new Date(updateValoracionDto.deleted_at)
        : null;
    }

    valoracion.updatedAt = new Date();

    return valoracion;
  }
}
