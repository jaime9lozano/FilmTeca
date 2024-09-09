import { Module } from '@nestjs/common';
import { PeliculasService } from './peliculas.service';
import { PeliculasController } from './peliculas.controller';
import { CacheModule } from '@nestjs/cache-manager';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pelicula } from './entities/pelicula.entity';
import { PeliculasMapper } from './mapeador/peliculas-mapper';
import { StorageModule } from '../storage/storage.module';
import { Generos } from '../generos/entities/genero.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Pelicula]),
    TypeOrmModule.forFeature([Generos]),
    CacheModule.register(),
    StorageModule,
  ],
  controllers: [PeliculasController],
  providers: [PeliculasService, PeliculasMapper],
  exports: [PeliculasService, PeliculasMapper],
})
export class PeliculasModule {}
