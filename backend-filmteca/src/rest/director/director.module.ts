import { Module } from '@nestjs/common';
import { DirectorService } from './director.service';
import { DirectorController } from './director.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Director } from './entities/director.entity';
import { CacheModule } from '@nestjs/cache-manager';
import { DirectorMapper } from './mapeador/director-mapper';

@Module({
  imports: [TypeOrmModule.forFeature([Director]), CacheModule.register()],
  controllers: [DirectorController],
  providers: [DirectorService, DirectorMapper],
  exports: [DirectorService, DirectorMapper],
})
export class DirectorModule {}
