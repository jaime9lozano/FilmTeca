import { Module } from '@nestjs/common';
import { PeliculasService } from './peliculas.service';
import { PeliculasController } from './peliculas.controller';
import { CacheModule } from '@nestjs/cache-manager';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pelicula } from './entities/pelicula.entity';
import { PeliculasMapper } from './mapeador/peliculas-mapper';
import { StorageModule } from '../storage/storage.module';
import { Generos } from '../generos/entities/genero.entity';
import { Actor } from '../actor/entities/actor.entity';
import { Premio } from '../premio/entities/premio.entity';
import { Director } from '../director/entities/director.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Pelicula]),
    TypeOrmModule.forFeature([Generos]),
    TypeOrmModule.forFeature([Director]),
    TypeOrmModule.forFeature([Actor]),
    TypeOrmModule.forFeature([Premio]),
    CacheModule.register(),
    StorageModule,
  ],
  controllers: [PeliculasController],
  providers: [PeliculasService, PeliculasMapper],
  exports: [PeliculasService, PeliculasMapper],
})
export class PeliculasModule {}
