import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePeliculaDto } from '../dto/create-pelicula.dto';
import { Pelicula } from '../entities/pelicula.entity';
import { UpdatePeliculaDto } from '../dto/update-pelicula.dto';
import { In, Repository } from 'typeorm';
import { Generos } from '../../generos/entities/genero.entity';
import { InjectRepository } from '@nestjs/typeorm';

// Asegúrate de crear este DTO

@Injectable()
export class PeliculasMapper {
  constructor(
    @InjectRepository(Generos)
    private readonly generoRepository: Repository<Generos>,
  ) {}

  toEntity(
    createPeliculaDto: CreatePeliculaDto,
    generos: Generos[] = [], // Añadido parámetro para géneros ya obtenidos
    pelicula?: Pelicula,
  ): Pelicula {
    const peliculaEntity = pelicula || new Pelicula();

    // Mapear campos básicos del DTO a la entidad
    peliculaEntity.title = createPeliculaDto.title;
    peliculaEntity.sinopsis = createPeliculaDto.sinopsis;
    peliculaEntity.duration = createPeliculaDto.duration;
    peliculaEntity.release_year = createPeliculaDto.release_year;
    peliculaEntity.country_of_origin = createPeliculaDto.country_of_origin;
    peliculaEntity.music_by = createPeliculaDto.music_by;
    peliculaEntity.photography_by = createPeliculaDto.photography_by;
    peliculaEntity.image = createPeliculaDto.image;

    // Asignar entidades `Generos` a la entidad `Pelicula`
    peliculaEntity.generos = generos;

    return peliculaEntity;
  }

  async toUpdateEntity(
    updatePeliculaDto: UpdatePeliculaDto,
    pelicula: Pelicula,
  ): Promise<Pelicula> {
    if (updatePeliculaDto.generos && updatePeliculaDto.generos.length > 0) {
      const generos = await this.generoRepository.findBy({
        id: In(updatePeliculaDto.generos),
      });

      if (generos.length !== updatePeliculaDto.generos.length) {
        throw new NotFoundException('Algunos géneros no fueron encontrados');
      }

      pelicula.generos = generos; // Actualizamos las entidades `Generos`
    }

    return {
      ...pelicula,
      ...updatePeliculaDto,
      generos: pelicula.generos, // Mantenemos los géneros ya convertidos
    };
  }
}
