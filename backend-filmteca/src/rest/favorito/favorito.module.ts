import { Module } from '@nestjs/common';
import { FavoritoService } from './favorito.service';
import { FavoritoController } from './favorito.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CacheModule } from '@nestjs/cache-manager';
import { Favorito } from './entities/favorito.entity';
import { Usuario } from '../users/entities/user.entity';
import { Pelicula } from '../peliculas/entities/pelicula.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Favorito]),
    TypeOrmModule.forFeature([Pelicula]),
    TypeOrmModule.forFeature([Usuario]),
    CacheModule.register(),
  ],
  controllers: [FavoritoController],
  providers: [FavoritoService],
  exports: [FavoritoService],
})
export class FavoritoModule {}
