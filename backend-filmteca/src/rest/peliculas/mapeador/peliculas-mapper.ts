import { Injectable } from '@nestjs/common';
import { CreatePeliculaDto } from '../dto/create-pelicula.dto';
import { Pelicula } from '../entities/pelicula.entity';
import { UpdatePeliculaDto } from '../dto/update-pelicula.dto';

// Asegúrate de crear este DTO

@Injectable()
export class PeliculasMapper {
  toEntity(
    createPeliculaDto: CreatePeliculaDto,
    pelicula?: Pelicula,
  ): Pelicula {
    const peliculaEntity = pelicula || new Pelicula();
    return {
      ...peliculaEntity,
      ...createPeliculaDto,
    };
  }

  toUpdateEntity(
    updatePeliculaDto: UpdatePeliculaDto,
    pelicula: Pelicula,
  ): Pelicula {
    return {
      ...pelicula,
      ...updatePeliculaDto,
      // Se puede añadir lógica adicional aquí si es necesario
    };
  }
}
