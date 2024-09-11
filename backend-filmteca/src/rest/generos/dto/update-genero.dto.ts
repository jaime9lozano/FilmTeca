import { IsDateString, IsOptional, IsString, Length } from 'class-validator';

export class UpdateGeneroDto {
  @IsOptional()
  @IsString()
  @Length(1, 255, { message: 'El nombre debe tener entre 1 y 255 caracteres' })
  name?: string;

  @IsOptional()
  @IsDateString({}, { message: 'El formato de la fecha no es válido' })
  deleted_at?: string | null; // Se permite `null` para restaurar la película
}
