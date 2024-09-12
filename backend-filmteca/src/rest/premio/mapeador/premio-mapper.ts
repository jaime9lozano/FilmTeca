import { Injectable } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { CreatePremioDto } from '../dto/create-premio.dto';
import { Premio } from '../entities/premio.entity';
import { UpdatePremioDto } from '../dto/update-premio.dto';

@Injectable()
export class PremioMapper {
  toEntity(createPremioDto: CreatePremioDto): Premio {
    const premio = new Premio();
    premio.name = createPremioDto.name;
    return premio;
  }

  updateEntity(updatePremioDto: UpdatePremioDto, premio: Premio): Premio {
    return plainToClass(Premio, {
      ...premio,
      name: updatePremioDto.name ?? premio.name,
      deletedAt: updatePremioDto.deleted_at ?? premio.deletedAt, // Permite actualizar deletedAt
    });
  }
}
