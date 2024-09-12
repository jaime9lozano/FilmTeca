import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreatePremioDto } from './dto/create-premio.dto';
import { UpdatePremioDto } from './dto/update-premio.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { Premio } from './entities/premio.entity';
import { PremioMapper } from './mapeador/premio-mapper';
import {
  FilterOperator,
  FilterSuffix,
  paginate,
  PaginateQuery,
} from 'nestjs-paginate';

@Injectable()
export class PremioService {
  private readonly logger = new Logger(PremioService.name);

  constructor(
    @InjectRepository(Premio)
    private readonly premioRepository: Repository<Premio>,
    private readonly premioMapper: PremioMapper,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async findAll(): Promise<any> {
    this.logger.log('Find all premios without pagination');

    // Crear el query builder
    const queryBuilder = this.premioRepository.createQueryBuilder('premio');

    // Filtrar los géneros que no están eliminados (deletedAt es NULL)
    queryBuilder.where('premio.deletedAt IS NULL');

    // Ejecutar la consulta y obtener los géneros
    // Devolver un array simple de géneros
    return await queryBuilder.getMany();
  }

  async findOne(id: number) {
    this.logger.log(`Find one premio by id: ${id}`);
    const cacheKey = `premio_${id}`;
    const cache: Premio = await this.cacheManager.get(cacheKey);
    if (cache) {
      this.logger.log('Cache hit');
      return cache;
    }

    const premio = await this.premioRepository
      .createQueryBuilder('premio')
      .where('premio.id = :id', { id })
      .getOne();

    if (!premio) {
      throw new NotFoundException(`Premio con id ${id} no encontrada`);
    }

    await this.cacheManager.set(cacheKey, premio);
    return premio;
  }

  async create(createPremioDto: CreatePremioDto) {
    this.logger.log('Create premio');

    // Convertir el DTO en entidad Pelicula con géneros ya obtenidos
    const premioEntity = this.premioMapper.toEntity(createPremioDto);

    // Guardar la entidad en la base de datos
    return await this.premioRepository.save(premioEntity);
  }

  async update(id: number, updatePremioDto: UpdatePremioDto) {
    this.logger.log(`Update Premio by id: ${id}`);

    // Buscar la película existente
    const premio = await this.premioRepository.findOne({
      where: { id },
    });

    if (!premio) {
      throw new NotFoundException(`Premio con id ${id} no encontrada`);
    }

    // Mapear campos básicos del DTO a la entidad
    Object.assign(premio, updatePremioDto);

    // Guardar la película actualizada
    return await this.premioRepository.save(premio);
  }

  async remove(id: number) {
    this.logger.log(`Remove premio by id: ${id}`);
    const premio = await this.findOne(id);

    // Establecer la fecha actual en deletedAt
    premio.deletedAt = new Date();

    // Guardar los cambios en la base de datos
    await this.premioRepository.save(premio);
  }
}
