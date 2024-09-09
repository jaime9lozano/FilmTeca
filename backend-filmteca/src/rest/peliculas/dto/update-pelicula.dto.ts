import {
  IsArray,
  IsDateString,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  Min,
} from 'class-validator';

export class UpdatePeliculaDto {
  @IsOptional()
  @IsString()
  @Length(1, 255, { message: 'El título debe tener entre 1 y 255 caracteres' })
  title?: string;

  @IsOptional()
  @IsString()
  sinopsis?: string;

  @IsOptional()
  @IsNumber()
  @Min(1, { message: 'La duración debe ser mayor a 0' })
  duration?: number;

  @IsOptional()
  @IsNumber()
  @Min(1900, { message: 'El año de estreno debe ser mayor a 1900' })
  release_year?: number;

  @IsOptional()
  @IsString()
  @Length(1, 100, {
    message: 'El país de origen debe tener entre 1 y 100 caracteres',
  })
  country_of_origin?: string;

  @IsOptional()
  @IsString()
  @Length(1, 100, {
    message: 'El nombre del compositor debe tener entre 1 y 100 caracteres',
  })
  music_by?: string;

  @IsOptional()
  @IsString()
  @Length(1, 100, {
    message:
      'El nombre del director de fotografía debe tener entre 1 y 100 caracteres',
  })
  photography_by?: string;

  @IsString()
  @IsOptional()
  image?: string;

  @IsOptional()
  @IsArray()
  @IsInt({ each: true, message: 'Los géneros deben ser números enteros' })
  generos?: number[];

  @IsOptional()
  @IsArray()
  @IsInt({ each: true, message: 'Los directores deben ser números enteros' })
  directores?: number[];

  @IsOptional()
  @IsArray()
  @IsInt({ each: true, message: 'Los actores deben ser números enteros' })
  actores?: number[];

  @IsOptional()
  @IsArray()
  @IsInt({ each: true, message: 'Los premios deben ser números enteros' })
  premios?: number[];

  @IsOptional()
  @IsDateString({}, { message: 'El formato de la fecha no es válido' })
  deleted_at?: string | null; // Se permite `null` para restaurar la película
}
