import { Module } from '@nestjs/common';
import { PeliculasService } from './peliculas.service';
import { PeliculasController } from './peliculas.controller';
import { CacheModule } from '@nestjs/cache-manager';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pelicula } from './entities/pelicula.entity';
import { PeliculasMapper } from './mapeador/peliculas-mapper';
import { StorageModule } from '../storage/storage.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Pelicula]),
    CacheModule.register(),
    StorageModule,
  ],
  controllers: [PeliculasController],
  providers: [PeliculasService, PeliculasMapper],
  exports: [PeliculasService, PeliculasMapper],
})
export class PeliculasModule {}
