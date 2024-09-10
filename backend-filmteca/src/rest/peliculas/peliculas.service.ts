import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Pelicula } from './entities/pelicula.entity';
import { UpdatePeliculaDto } from './dto/update-pelicula.dto';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import {
  FilterOperator,
  FilterSuffix,
  paginate,
  PaginateQuery,
} from 'nestjs-paginate';

import { Request } from 'express';
import { CreatePeliculaDto } from './dto/create-pelicula.dto';
import { PeliculasMapper } from './mapeador/peliculas-mapper';
import { StorageService } from '../storage/storage.service';
import { Generos } from '../generos/entities/genero.entity';
import { Director } from '../director/entities/director.entity';
import { Actor } from '../actor/entities/actor.entity';
import { Premio } from '../premio/entities/premio.entity';

@Injectable()
export class PeliculasService {
  private readonly logger = new Logger(PeliculasService.name);

  constructor(
    @InjectRepository(Pelicula)
    private readonly peliculaRepository: Repository<Pelicula>,
    @InjectRepository(Generos)
    private readonly generoRepository: Repository<Generos>,
    @InjectRepository(Director)
    private readonly directorRepository: Repository<Director>,
    @InjectRepository(Actor)
    private readonly actorRepository: Repository<Actor>,
    @InjectRepository(Premio)
    private readonly premioRepository: Repository<Premio>,
    private readonly peliculasMapper: PeliculasMapper,
    private readonly storageService: StorageService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async findAll(query: PaginateQuery): Promise<any> {
    this.logger.log('Find all peliculas');

    if (!query.path) {
      throw new Error('Path is required for pagination');
    }

    const queryBuilder = this.peliculaRepository.createQueryBuilder('pelicula');
    queryBuilder.where('pelicula.deletedAt IS NULL');

    const pagination = await paginate(query, queryBuilder, {
      sortableColumns: ['title', 'release_year', 'duration'],
      defaultSortBy: [['id', 'ASC']],
      searchableColumns: ['title', 'release_year', 'duration'],
      filterableColumns: {
        title: [FilterOperator.EQ, FilterSuffix.NOT],
        release_year: true,
        duration: true,
      },
    });

    return {
      data: pagination.data,
      meta: pagination.meta,
      links: pagination.links,
    };
  }

  async findOne(id: number): Promise<Pelicula> {
    this.logger.log(`Find one pelicula by id: ${id}`);
    const cacheKey = `pelicula_${id}`;
    const cache: Pelicula = await this.cacheManager.get(cacheKey);
    if (cache) {
      this.logger.log('Cache hit');
      return cache;
    }

    const pelicula = await this.peliculaRepository
      .createQueryBuilder('pelicula')
      .leftJoinAndSelect('pelicula.generos', 'generos')
      .leftJoinAndSelect('pelicula.actores', 'actores')
      .leftJoinAndSelect('pelicula.premios', 'premios')
      .leftJoinAndSelect('pelicula.directores', 'directores')
      .where('pelicula.id = :id', { id })
      .getOne();

    if (!pelicula) {
      throw new NotFoundException(`Pelicula con id ${id} no encontrada`);
    }

    await this.cacheManager.set(cacheKey, pelicula);
    return pelicula;
  }

  async create(createPeliculaDto: CreatePeliculaDto): Promise<Pelicula> {
    this.logger.log('Create pelicula');

    // Obtener géneros de forma sincrónica
    const generos = await this.generoRepository.find({
      where: { id: In(createPeliculaDto.generos) },
    });

    // Obtener directores de forma sincrónica
    const directores = await this.directorRepository.find({
      where: { id: In(createPeliculaDto.directores) },
    });

    // Obtener premios de forma sincrónica
    const premios = await this.premioRepository.find({
      where: { id: In(createPeliculaDto.premios) },
    });

    // Obtener actores de forma sincrónica
    const actores = await this.actorRepository.find({
      where: { id: In(createPeliculaDto.actores) },
    });

    // Convertir el DTO en entidad Pelicula con géneros ya obtenidos
    const peliculaEntity = this.peliculasMapper.toEntity(
      createPeliculaDto,
      generos,
      directores,
      premios,
      actores,
    );

    // Guardar la entidad en la base de datos
    return await this.peliculaRepository.save(peliculaEntity);
  }

  async update(
    id: number,
    updatePeliculaDto: UpdatePeliculaDto,
  ): Promise<Pelicula> {
    this.logger.log(`Update pelicula by id: ${id}`);

    // Buscar la película existente
    const pelicula = await this.peliculaRepository.findOne({
      where: { id },
      relations: ['generos'], // Asegúrate de incluir las relaciones necesarias
    });

    if (!pelicula) {
      throw new NotFoundException(`Pelicula con id ${id} no encontrada`);
    }

    // Mapear campos básicos del DTO a la entidad
    Object.assign(pelicula, updatePeliculaDto);

    // Manejar los géneros si se proporcionan en el DTO
    if (updatePeliculaDto.generos && updatePeliculaDto.generos.length > 0) {
      // Buscar los géneros proporcionados en el DTO
      const nuevosGeneros = await this.generoRepository.find({
        where: { id: In(updatePeliculaDto.generos) },
      });

      // Verificar si todos los géneros proporcionados existen en la base de datos
      if (nuevosGeneros.length !== updatePeliculaDto.generos.length) {
        throw new NotFoundException('Algunos géneros no fueron encontrados');
      }

      // Combinar los géneros actuales con los nuevos géneros
      pelicula.generos = [...pelicula.generos, ...nuevosGeneros];

      // Eliminar duplicados si hay géneros repetidos
      pelicula.generos = Array.from(new Set(pelicula.generos));
    } else {
      // Si no se proporcionan géneros, se dejan los géneros actuales como están
      pelicula.generos = pelicula.generos || []; // Se asegura de que sea un array si estaba vacío antes
    }

    // Manejar los premios si se proporcionan en el DTO
    if (updatePeliculaDto.premios && updatePeliculaDto.premios.length > 0) {
      const nuevosPremios = await this.premioRepository.find({
        where: { id: In(updatePeliculaDto.premios) },
      });

      if (nuevosPremios.length !== updatePeliculaDto.premios.length) {
        throw new NotFoundException('Algunos premios no fueron encontrados');
      }

      pelicula.premios = [...pelicula.premios, ...nuevosPremios];
      pelicula.premios = Array.from(new Set(pelicula.premios));
    } else {
      pelicula.premios = pelicula.premios || [];
    }

    // Manejar los directores si se proporcionan en el DTO
    if (
      updatePeliculaDto.directores &&
      updatePeliculaDto.directores.length > 0
    ) {
      const nuevosDirectores = await this.directorRepository.find({
        where: { id: In(updatePeliculaDto.directores) },
      });

      if (nuevosDirectores.length !== updatePeliculaDto.directores.length) {
        throw new NotFoundException('Algunos directores no fueron encontrados');
      }

      pelicula.directores = [...pelicula.directores, ...nuevosDirectores];
      pelicula.directores = Array.from(new Set(pelicula.directores));
    } else {
      pelicula.directores = pelicula.directores || [];
    }

    // Manejar los actores si se proporcionan en el DTO
    if (updatePeliculaDto.actores && updatePeliculaDto.actores.length > 0) {
      const nuevosActores = await this.actorRepository.find({
        where: { id: In(updatePeliculaDto.actores) },
      });

      if (nuevosActores.length !== updatePeliculaDto.actores.length) {
        throw new NotFoundException('Algunos actores no fueron encontrados');
      }

      pelicula.actores = [...pelicula.actores, ...nuevosActores];
      pelicula.actores = Array.from(new Set(pelicula.actores));
    } else {
      pelicula.actores = pelicula.actores || [];
    }

    // Guardar la película actualizada
    return await this.peliculaRepository.save(pelicula);
  }

  async remove(id: number): Promise<void> {
    this.logger.log(`Remove pelicula by id: ${id}`);
    const pelicula = await this.peliculaRepository.findOne({ where: { id } });
    if (!pelicula) {
      throw new NotFoundException(`Pelicula con id ${id} no encontrada`);
    }

    // Establecer la fecha actual en deletedAt
    pelicula.deletedAt = new Date();

    // Guardar los cambios en la base de datos
    await this.peliculaRepository.save(pelicula);
  }

  async updateImage(
    id: number,
    file: Express.Multer.File,
    req: Request,
    withUrl: boolean = true,
  ): Promise<Pelicula> {
    this.logger.log(`Update image of pelicula with id: ${id}`);

    const pelicula = await this.peliculaRepository.findOne({ where: { id } });

    if (!pelicula) {
      throw new NotFoundException(`Pelicula con id ${id} no encontrada`);
    }
    if (!file) {
      throw new BadRequestException('No se proporcionó ninguna imagen');
    }
    this.logger.log(`Borrando imagen ${pelicula.image}`);
    const imagePath = this.storageService.getFileNameWithouUrl(pelicula.image);
    try {
      this.storageService.removeFile(imagePath);
    } catch (error) {
      this.logger.error(error);
    }

    pelicula.image = file.filename;
    return await this.peliculaRepository.save(pelicula);
  }
}
