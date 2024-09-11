import { UpdateGeneroDto } from '../dto/update-genero.dto';
import { Generos } from '../entities/genero.entity';
import { plainToClass } from 'class-transformer';
import { CreateGeneroDto } from '../dto/create-genero.dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class GeneroMapper {
  // Convierte CreateGeneroDto a la entidad Generos
  toEntity(createGeneroDto: CreateGeneroDto): Generos {
    const genero = new Generos();
    genero.name = createGeneroDto.name;
    // No se asigna películas ni deletedAt ya que no son obligatorios al crear
    return genero;
  }

  // Actualiza una entidad Generos a partir de un UpdateGeneroDto
  updateEntity(updateGeneroDto: UpdateGeneroDto, genero: Generos): Generos {
    return plainToClass(Generos, {
      ...genero, // Mantiene los valores existentes de la entidad
      name: updateGeneroDto.name ?? genero.name,
      deletedAt: updateGeneroDto.deleted_at ?? genero.deletedAt, // Permite actualizar deletedAt
    });
  }
}
