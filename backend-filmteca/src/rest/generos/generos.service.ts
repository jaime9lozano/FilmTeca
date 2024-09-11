import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateGeneroDto } from './dto/create-genero.dto';
import { UpdateGeneroDto } from './dto/update-genero.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Generos } from './entities/genero.entity';
import { Repository } from 'typeorm';
import { GeneroMapper } from './mapeador/generos-mapper';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import {
  FilterOperator,
  FilterSuffix,
  paginate,
  PaginateQuery,
} from 'nestjs-paginate';

@Injectable()
export class GenerosService {
  private readonly logger = new Logger(GenerosService.name);

  constructor(
    @InjectRepository(Generos)
    private readonly generoRepository: Repository<Generos>,
    private readonly generosMapper: GeneroMapper,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async findAll(query: PaginateQuery): Promise<any> {
    this.logger.log('Find all generos');

    if (!query.path) {
      throw new Error('Path is required for pagination');
    }

    const queryBuilder = this.generoRepository.createQueryBuilder('genero');
    queryBuilder.where('genero.deletedAt IS NULL');
    query.limit = 50;

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
    this.logger.log(`Find one genero by id: ${id}`);
    const cacheKey = `genero_${id}`;
    const cache: Generos = await this.cacheManager.get(cacheKey);
    if (cache) {
      this.logger.log('Cache hit');
      return cache;
    }

    const genero = await this.generoRepository
      .createQueryBuilder('genero')
      .where('genero.id = :id', { id })
      .getOne();

    if (!genero) {
      throw new NotFoundException(`Genero con id ${id} no encontrada`);
    }

    await this.cacheManager.set(cacheKey, genero);
    return genero;
  }

  async create(createGeneroDto: CreateGeneroDto) {
    this.logger.log('Create genero');

    // Convertir el DTO en entidad Pelicula con géneros ya obtenidos
    const generoEntity = this.generosMapper.toEntity(createGeneroDto);

    // Guardar la entidad en la base de datos
    return await this.generoRepository.save(generoEntity);
  }

  async update(id: number, updateGeneroDto: UpdateGeneroDto) {
    this.logger.log(`Update genero by id: ${id}`);

    // Buscar la película existente
    const genero = await this.generoRepository.findOne({
      where: { id },
    });

    if (!genero) {
      throw new NotFoundException(`Genero con id ${id} no encontrada`);
    }

    // Mapear campos básicos del DTO a la entidad
    Object.assign(genero, updateGeneroDto);

    // Guardar la película actualizada
    return await this.generoRepository.save(genero);
  }

  async remove(id: number) {
    this.logger.log(`Remove genero by id: ${id}`);
    const genero = await this.generoRepository.findOne({ where: { id } });
    if (!genero) {
      throw new NotFoundException(`Genero con id ${id} no encontrada`);
    }

    // Establecer la fecha actual en deletedAt
    genero.deletedAt = new Date();

    // Guardar los cambios en la base de datos
    await this.generoRepository.save(genero);
  }
}
