import { Module } from '@nestjs/common';
import { ActorService } from './actor.service';
import { ActorController } from './actor.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CacheModule } from '@nestjs/cache-manager';
import { Actor } from './entities/actor.entity';
import { ActorMapper } from './mapeador/actor-mapper';

@Module({
  imports: [TypeOrmModule.forFeature([Actor]), CacheModule.register()],
  controllers: [ActorController],
  providers: [ActorService, ActorMapper],
  exports: [ActorService, ActorMapper],
})
export class ActorModule {}
