import { Module } from '@nestjs/common';
import { ValoracionService } from './valoracion.service';
import { ValoracionController } from './valoracion.controller';
import { ValoracionMapper } from './mapeador/valoracion-mapper';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Usuario } from '../users/entities/user.entity';
import { Valoracion } from './entities/valoracion.entity';
import { CacheModule } from '@nestjs/cache-manager';
import { PeliculasService } from '../peliculas/peliculas.service';
import { PeliculasModule } from '../peliculas/peliculas.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Usuario]),
    TypeOrmModule.forFeature([Valoracion]),
    CacheModule.register(),
    PeliculasModule,
  ],
  controllers: [ValoracionController],
  providers: [ValoracionService, ValoracionMapper],
  exports: [ValoracionService, ValoracionMapper],
})
export class ValoracionModule {}
