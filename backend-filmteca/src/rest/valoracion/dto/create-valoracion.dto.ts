import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class CreateValoracionDto {
  @IsOptional()
  @IsString({ message: 'La reseña debe ser una cadena de texto' })
  review?: string;

  @IsNotEmpty({ message: 'La calificación es obligatoria' })
  @IsNumber({}, { message: 'La calificación debe ser un número' })
  @Min(1, { message: 'La calificación mínima es 1' })
  @Max(10, { message: 'La calificación máxima es 10' })
  rating: number;

  @IsNotEmpty({ message: 'El ID de la película es obligatorio' })
  peliculaId: number;
}
