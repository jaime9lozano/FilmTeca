import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateValoracionDto } from './dto/create-valoracion.dto';
import { UpdateValoracionDto } from './dto/update-valoracion.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from '../users/entities/user.entity';
import { Valoracion } from './entities/valoracion.entity';
import { ValoracionMapper } from './mapeador/valoracion-mapper';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import {
  FilterOperator,
  FilterSuffix,
  paginate,
  PaginateQuery,
} from 'nestjs-paginate';
import { PeliculasService } from '../peliculas/peliculas.service';
import { Pelicula } from '../peliculas/entities/pelicula.entity';

@Injectable()
export class ValoracionService {
  private readonly logger = new Logger(ValoracionService.name);

  constructor(
    private readonly peliculaService: PeliculasService,
    @InjectRepository(Usuario)
    private readonly userRepository: Repository<Usuario>,
    @InjectRepository(Valoracion)
    private readonly valoracionRepository: Repository<Valoracion>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async findAll(query: PaginateQuery): Promise<any> {
    this.logger.log('Find all valoraciones');

    if (!query.path) {
      throw new Error('Path is required for pagination');
    }

    const queryBuilder =
      this.valoracionRepository.createQueryBuilder('valoracion');
    queryBuilder.where('valoracion.deletedAt IS NULL');
    query.limit = 10;
    queryBuilder
      .leftJoinAndSelect('valoracion.pelicula', 'pelicula') // Relación con Película
      .leftJoinAndSelect('valoracion.user', 'user'); // Relación con Usuario

    const pagination = await paginate(query, queryBuilder, {
      sortableColumns: ['rating'],
      defaultSortBy: [['id', 'ASC']],
      searchableColumns: ['rating'],
      filterableColumns: {
        rating: [FilterOperator.EQ, FilterSuffix.NOT],
      },
    });

    return {
      data: pagination.data,
      meta: pagination.meta,
      links: pagination.links,
    };
  }

  async findOne(id: number): Promise<Valoracion> {
    this.logger.log(`Find one valoracion by id: ${id}`);
    const cacheKey = `valoracion_${id}`;
    const cache: Valoracion = await this.cacheManager.get(cacheKey);
    if (cache) {
      this.logger.log('Cache hit');
      return cache;
    }

    const valoracion = await this.valoracionRepository
      .createQueryBuilder('valoracion')
      .where('valoracion.id = :id', { id })
      .leftJoinAndSelect('valoracion.pelicula', 'pelicula') // Relación con Película
      .leftJoinAndSelect('valoracion.user', 'user') // Relación con Usuario
      .getOne();

    if (!valoracion) {
      throw new NotFoundException(`Valoracion con id ${id} no encontrada`);
    }

    await this.cacheManager.set(cacheKey, valoracion);
    return valoracion;
  }

  async create(
    createValoracionDto: CreateValoracionDto,
    userId: number,
  ): Promise<Valoracion> {
    this.logger.log('Create valoracion');

    // Obtener película y usuario desde sus respectivos servicios
    const pelicula = await this.peliculaService.findOne(
      createValoracionDto.peliculaId,
    );
    const user = await this.userRepository
      .createQueryBuilder('user')
      .where('user.id = :id', { id: userId })
      .getOne();

    if (!user) {
      throw new NotFoundException(`Usuario con id ${userId} no encontrado`);
    }

    // Crear la entidad Valoracion a partir del DTO
    const valoracion = ValoracionMapper.toEntity(
      createValoracionDto,
      pelicula,
      user,
    );

    // Guardar la valoración en la base de datos
    return this.valoracionRepository.save(valoracion);
  }

  async update(
    id: number,
    updateValoracionDto: UpdateValoracionDto,
  ): Promise<Valoracion> {
    // Obtener la valoración existente
    const valoracion = await this.findOne(id);

    // Si el DTO contiene un nuevo ID de película, buscamos la nueva película
    let pelicula: Pelicula | undefined;
    if (updateValoracionDto.peliculaId) {
      pelicula = await this.peliculaService.findOne(
        updateValoracionDto.peliculaId,
      );
    }

    // Actualizamos la valoración con el DTO
    const updatedValoracion = ValoracionMapper.updateToEntity(
      updateValoracionDto,
      valoracion,
      pelicula,
    );

    // Guardamos la valoración actualizada
    return this.valoracionRepository.save(updatedValoracion);
  }

  async remove(id: number): Promise<void> {
    const valoracion = await this.findOne(id);

    // Establecemos el campo `deletedAt` a la fecha actual (soft delete)
    valoracion.deletedAt = new Date();

    await this.valoracionRepository.save(valoracion);
  }
}
