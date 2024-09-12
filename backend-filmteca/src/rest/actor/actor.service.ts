import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateActorDto } from './dto/create-actor.dto';
import { UpdateActorDto } from './dto/update-actor.dto';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { InjectRepository } from '@nestjs/typeorm';
import { Actor } from './entities/actor.entity';
import { Repository } from 'typeorm';
import { ActorMapper } from './mapeador/actor-mapper';
import {
  FilterOperator,
  FilterSuffix,
  paginate,
  PaginateQuery,
} from 'nestjs-paginate';

@Injectable()
export class ActorService {
  private readonly logger = new Logger(ActorService.name);

  constructor(
    @InjectRepository(Actor)
    private readonly actorRepository: Repository<Actor>,
    private readonly actorMapper: ActorMapper,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async findAll(query: PaginateQuery) {
    this.logger.log('Find all actores');

    if (!query.path) {
      throw new Error('Path is required for pagination');
    }

    const queryBuilder = this.actorRepository.createQueryBuilder('actor');
    queryBuilder.where('actor.deletedAt IS NULL');

    // Si no se especifica un límite, no aplicamos paginación
    const pagination = await paginate(query, queryBuilder, {
      sortableColumns: ['name'],
      defaultSortBy: [['id', 'ASC']],
      searchableColumns: ['name'],
      filterableColumns: {
        name: [FilterOperator.EQ, FilterSuffix.NOT],
      },
    });

    return {
      data: pagination.data,
      meta: pagination.meta,
      links: pagination.links,
    };
  }

  async findOne(id: number) {
    this.logger.log(`Find one actor by id: ${id}`);
    const cacheKey = `actor_${id}`;
    const cache: Actor = await this.cacheManager.get(cacheKey);
    if (cache) {
      this.logger.log('Cache hit');
      return cache;
    }

    const actor = await this.actorRepository
      .createQueryBuilder('actor')
      .where('actor.id = :id', { id })
      .getOne();

    if (!actor) {
      throw new NotFoundException(`Actor con id ${id} no encontrada`);
    }

    await this.cacheManager.set(cacheKey, actor);
    return actor;
  }

  async create(createActorDto: CreateActorDto) {
    this.logger.log('Create actor');

    // Convertir el DTO en entidad Pelicula con géneros ya obtenidos
    const actorEntity = this.actorMapper.toEntity(createActorDto);

    // Guardar la entidad en la base de datos
    return await this.actorRepository.save(actorEntity);
  }

  async update(id: number, updateActorDto: UpdateActorDto) {
    this.logger.log(`Update actor by id: ${id}`);

    // Buscar la película existente
    const actor = await this.actorRepository.findOne({
      where: { id },
    });

    if (!actor) {
      throw new NotFoundException(`Actor con id ${id} no encontrada`);
    }

    // Mapear campos básicos del DTO a la entidad
    Object.assign(actor, updateActorDto);

    // Guardar la película actualizada
    return await this.actorRepository.save(actor);
  }

  async remove(id: number) {
    this.logger.log(`Remove actor by id: ${id}`);
    const actor = await this.findOne(id);

    // Establecer la fecha actual en deletedAt
    actor.deletedAt = new Date();

    // Guardar los cambios en la base de datos
    await this.actorRepository.save(actor);
  }
}
