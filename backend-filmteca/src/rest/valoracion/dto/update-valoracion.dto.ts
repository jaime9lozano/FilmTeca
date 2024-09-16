import {
  IsDateString,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class UpdateValoracionDto {
  @IsOptional()
  @IsString({ message: 'La reseña debe ser una cadena de texto' })
  review?: string;

  @IsOptional()
  @IsNumber({}, { message: 'La calificación debe ser un número' })
  @Min(1, { message: 'La calificación mínima es 1' })
  @Max(10, { message: 'La calificación máxima es 10' })
  rating?: number;

  @IsOptional()
  peliculaId?: number;

  @IsOptional()
  @IsDateString({}, { message: 'El formato de la fecha no es válido' })
  deleted_at?: string | null; // Se permite `null` para restaurar la película
}
