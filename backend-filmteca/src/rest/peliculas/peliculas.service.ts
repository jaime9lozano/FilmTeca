import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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

@Injectable()
export class PeliculasService {
  private readonly logger = new Logger(PeliculasService.name);

  constructor(
    @InjectRepository(Pelicula)
    private readonly peliculaRepository: Repository<Pelicula>,
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
    const pagination = await paginate(query, queryBuilder, {
      sortableColumns: ['title', 'release_year', 'duration'],
      defaultSortBy: [['title', 'ASC']],
      relations: ['generos', 'actores', 'premios'],
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
    const pelicula = this.peliculasMapper.toEntity(createPeliculaDto);

    return await this.peliculaRepository.save(pelicula);
  }

  async update(
    id: number,
    updatePeliculaDto: UpdatePeliculaDto,
  ): Promise<Pelicula> {
    this.logger.log(`Update pelicula by id: ${id}`);

    const pelicula = await this.peliculaRepository.findOne({
      where: { id },
      relations: ['generos', 'actores', 'premios'],
    });

    if (!pelicula) {
      throw new NotFoundException(`Pelicula con id ${id} no encontrada`);
    }

    Object.assign(pelicula, updatePeliculaDto);
    return await this.peliculaRepository.save(pelicula);
  }

  async remove(id: number): Promise<void> {
    this.logger.log(`Remove pelicula by id: ${id}`);
    const pelicula = await this.peliculaRepository.findOne({ where: { id } });
    if (!pelicula) {
      throw new NotFoundException(`Pelicula con id ${id} no encontrada`);
    }

    await this.peliculaRepository.remove(pelicula);
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
