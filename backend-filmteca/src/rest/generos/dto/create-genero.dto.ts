import { IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateGeneroDto {
  @IsString()
  @IsNotEmpty()
  @Length(1, 255, { message: 'El Nombre debe tener entre 1 y 255 caracteres' })
  name: string;
}
