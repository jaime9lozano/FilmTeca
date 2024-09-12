import { Injectable } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { CreateDirectorDto } from '../dto/create-director.dto';
import { Director } from '../entities/director.entity';
import { UpdateDirectorDto } from '../dto/update-director.dto';

@Injectable()
export class DirectorMapper {
  toEntity(createDirectorDto: CreateDirectorDto): Director {
    const director = new Director();
    director.name = createDirectorDto.name;
    return director;
  }

  updateEntity(
    updateDirectorDto: UpdateDirectorDto,
    director: Director,
  ): Director {
    return plainToClass(Director, {
      ...director,
      name: updateDirectorDto.name ?? director.name,
      deletedAt: updateDirectorDto.deleted_at ?? director.deletedAt, // Permite actualizar deletedAt
    });
  }
}
