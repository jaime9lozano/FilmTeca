import { Module } from '@nestjs/common';
import { ActorService } from './actor.service';
import { ActorController } from './actor.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Director } from '../director/entities/director.entity';
import { CacheModule } from '@nestjs/cache-manager';
import { Actor } from './entities/actor.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Actor]), CacheModule.register()],
  controllers: [ActorController],
  providers: [ActorService],
})
export class ActorModule {}
