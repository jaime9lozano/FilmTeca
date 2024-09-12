import {
  ArrayNotEmpty,
  IsArray,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  Min,
} from 'class-validator';

export class CreatePeliculaDto {
  @IsString()
  @IsNotEmpty()
  @Length(1, 255, { message: 'El título debe tener entre 1 y 255 caracteres' })
  title: string;

  @IsString()
  @IsNotEmpty({ message: 'La sinopsis no puede estar vacía' })
  sinopsis: string;

  @IsNumber()
  @Min(1, { message: 'La duración debe ser mayor a 0' })
  duration: number;

  @IsNumber()
  @Min(1900, { message: 'El año de estreno debe ser mayor a 1900' })
  release_year: number;

  @IsString()
  @IsNotEmpty({ message: 'El país de origen es obligatorio' })
  @Length(1, 100, {
    message: 'El país de origen debe tener entre 1 y 100 caracteres',
  })
  country_of_origin: string;

  @IsOptional()
  @IsString()
  @Length(0, 100, {
    message: 'El nombre del compositor debe tener entre 1 y 100 caracteres',
  })
  music_by?: string;

  @IsOptional()
  @IsString()
  @Length(0, 100, {
    message:
      'El nombre del director de fotografía debe tener entre 1 y 100 caracteres',
  })
  photography_by?: string;

  @IsNotEmpty({ message: 'La imagen no puede estar vacía' })
  @IsString()
  image: string;

  @IsArray()
  @ArrayNotEmpty({ message: 'Debe seleccionar al menos un género' })
  @IsInt({ each: true, message: 'Los géneros deben ser números enteros' }) // Asegura que cada elemento sea un número entero
  generos: number[];

  @IsArray()
  @ArrayNotEmpty({ message: 'Debe seleccionar al menos un director' })
  @IsInt({ each: true, message: 'Los directores deben ser números enteros' }) // Asegura que cada elemento sea un número entero
  directores: number[];

  @IsArray()
  @ArrayNotEmpty({ message: 'Debe seleccionar al menos un actor' })
  @IsInt({ each: true, message: 'Los actores deben ser números enteros' }) // Asegura que cada elemento sea un número entero
  actores: number[];

  @IsOptional()
  @IsArray()
  @IsInt({ each: true, message: 'Los premios deben ser números enteros' })
  premios?: number[];
}
