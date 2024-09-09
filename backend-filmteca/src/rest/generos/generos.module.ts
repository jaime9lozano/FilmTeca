import { Module } from '@nestjs/common';
import { GenerosService } from './generos.service';
import { GenerosController } from './generos.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Generos } from './entities/genero.entity';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [TypeOrmModule.forFeature([Generos]), CacheModule.register()],
  controllers: [GenerosController],
  providers: [GenerosService],
})
export class GenerosModule {}
