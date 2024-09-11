import { Module } from '@nestjs/common';
import { GenerosService } from './generos.service';
import { GenerosController } from './generos.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Generos } from './entities/genero.entity';
import { CacheModule } from '@nestjs/cache-manager';
import { GeneroMapper } from './mapeador/generos-mapper';
import { Pelicula } from '../peliculas/entities/pelicula.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Generos]),
    TypeOrmModule.forFeature([Pelicula]),
    CacheModule.register(),
  ],
  controllers: [GenerosController],
  providers: [GenerosService, GeneroMapper],
  exports: [GenerosService, GeneroMapper],
})
export class GenerosModule {}
