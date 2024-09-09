import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePeliculaDto } from '../dto/create-pelicula.dto';
import { Pelicula } from '../entities/pelicula.entity';
import { UpdatePeliculaDto } from '../dto/update-pelicula.dto';
import { In, Repository } from 'typeorm';
import { Generos } from '../../generos/entities/genero.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Premio } from '../../premio/entities/premio.entity';
import { Director } from '../../director/entities/director.entity';
import { Actor } from '../../actor/entities/actor.entity';

// Asegúrate de crear este DTO

@Injectable()
export class PeliculasMapper {
  toEntity(
    createPeliculaDto: CreatePeliculaDto,
    generos: Generos[] = [],
    directores: Director[] = [],
    premios: Premio[] = [],
    actores: Actor[] = [],
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

    // Asignar entidades
    peliculaEntity.generos = generos;
    peliculaEntity.actores = actores;
    peliculaEntity.premios = premios;
    peliculaEntity.directores = directores;

    return peliculaEntity;
  }
}
