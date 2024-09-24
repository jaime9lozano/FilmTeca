import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsDateString, IsOptional } from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsOptional()
  nombre?: string;
  @IsOptional()
  username?: string;
  @IsOptional()
  email?: string;
  @IsOptional()
  roles?: string[];
  @IsOptional()
  password?: string;
  @IsOptional()
  @IsDateString({}, { message: 'El formato de la fecha no es válido' })
  deleted_at?: String | null;
}
