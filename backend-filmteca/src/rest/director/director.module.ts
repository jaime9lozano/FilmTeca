import { Module } from '@nestjs/common';
import { DirectorService } from './director.service';
import { DirectorController } from './director.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pelicula } from '../peliculas/entities/pelicula.entity';
import { Generos } from '../generos/entities/genero.entity';
import { Director } from './entities/director.entity';
import { Actor } from '../actor/entities/actor.entity';
import { Premio } from '../premio/entities/premio.entity';
import { CacheModule } from '@nestjs/cache-manager';
import { StorageModule } from '../storage/storage.module';

@Module({
  imports: [TypeOrmModule.forFeature([Director]), CacheModule.register()],
  controllers: [DirectorController],
  providers: [DirectorService],
})
export class DirectorModule {}
