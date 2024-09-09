import { Module } from '@nestjs/common';
import { PremioService } from './premio.service';
import { PremioController } from './premio.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Director } from '../director/entities/director.entity';
import { CacheModule } from '@nestjs/cache-manager';
import { Premio } from './entities/premio.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Premio]), CacheModule.register()],
  controllers: [PremioController],
  providers: [PremioService],
})
export class PremioModule {}
