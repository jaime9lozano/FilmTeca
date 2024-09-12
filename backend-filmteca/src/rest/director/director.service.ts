import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateDirectorDto } from './dto/create-director.dto';
import { UpdateDirectorDto } from './dto/update-director.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { Director } from './entities/director.entity';
import { DirectorMapper } from './mapeador/director-mapper';
import {
  FilterOperator,
  FilterSuffix,
  paginate,
  PaginateQuery,
} from 'nestjs-paginate';

@Injectable()
export class DirectorService {
  private readonly logger = new Logger(DirectorService.name);

  constructor(
    @InjectRepository(Director)
    private readonly directorRepository: Repository<Director>,
    private readonly directorMapper: DirectorMapper,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async findAll(): Promise<any> {
    this.logger.log('Find all directores without pagination');

    // Crear el query builder
    const queryBuilder = this.directorRepository.createQueryBuilder('director');

    // Filtrar los géneros que no están eliminados (deletedAt es NULL)
    queryBuilder.where('director.deletedAt IS NULL');

    // Ejecutar la consulta y obtener los géneros
    // Devolver un array simple de géneros
    return await queryBuilder.getMany();
  }

  async findOne(id: number) {
    this.logger.log(`Find one director by id: ${id}`);
    const cacheKey = `director_${id}`;
    const cache: Director = await this.cacheManager.get(cacheKey);
    if (cache) {
      this.logger.log('Cache hit');
      return cache;
    }

    const actor = await this.directorRepository
      .createQueryBuilder('director')
      .where('director.id = :id', { id })
      .getOne();

    if (!actor) {
      throw new NotFoundException(`Director con id ${id} no encontrada`);
    }

    await this.cacheManager.set(cacheKey, actor);
    return actor;
  }

  async create(createDirectorDto: CreateDirectorDto) {
    this.logger.log('Create director');

    // Convertir el DTO en entidad Pelicula con géneros ya obtenidos
    const directorEntity = this.directorMapper.toEntity(createDirectorDto);

    // Guardar la entidad en la base de datos
    return await this.directorRepository.save(directorEntity);
  }

  async update(id: number, updateDirectorDto: UpdateDirectorDto) {
    this.logger.log(`Update director by id: ${id}`);

    // Buscar la película existente
    const director = await this.directorRepository.findOne({
      where: { id },
    });

    if (!director) {
      throw new NotFoundException(`Director con id ${id} no encontrada`);
    }

    // Mapear campos básicos del DTO a la entidad
    Object.assign(director, updateDirectorDto);

    // Guardar la película actualizada
    return await this.directorRepository.save(director);
  }

  async remove(id: number) {
    this.logger.log(`Remove director by id: ${id}`);
    const director = await this.findOne(id);

    // Establecer la fecha actual en deletedAt
    director.deletedAt = new Date();

    // Guardar los cambios en la base de datos
    await this.directorRepository.save(director);
  }
}
