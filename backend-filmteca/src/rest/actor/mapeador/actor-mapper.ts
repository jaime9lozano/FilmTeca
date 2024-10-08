import { Injectable } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { CreateActorDto } from '../dto/create-actor.dto';
import { Actor } from '../entities/actor.entity';
import { UpdateActorDto } from '../dto/update-actor.dto';

@Injectable()
export class ActorMapper {
  toEntity(createActorDto: CreateActorDto): Actor {
    const actor = new Actor();
    actor.name = createActorDto.name;
    return actor;
  }

  updateEntity(updateActorDto: UpdateActorDto, actor: Actor): Actor {
    return plainToClass(Actor, {
      ...actor,
      name: updateActorDto.name ?? actor.name,
      deletedAt: updateActorDto.deleted_at ?? actor.deletedAt, // Permite actualizar deletedAt
    });
  }
}
