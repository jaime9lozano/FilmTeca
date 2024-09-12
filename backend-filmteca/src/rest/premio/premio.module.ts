import { Module } from '@nestjs/common';
import { PremioService } from './premio.service';
import { PremioController } from './premio.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CacheModule } from '@nestjs/cache-manager';
import { Premio } from './entities/premio.entity';
import { PremioMapper } from './mapeador/premio-mapper';

@Module({
  imports: [TypeOrmModule.forFeature([Premio]), CacheModule.register()],
  controllers: [PremioController],
  providers: [PremioService, PremioMapper],
  exports: [PremioService, PremioMapper],
})
export class PremioModule {}
