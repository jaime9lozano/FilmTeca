import { Injectable } from '@nestjs/common';
import { UserSignUpDto } from '../dto/update-auth.dto';
import { CreateUserDto } from '../../users/dto/create-user.dto';
import { Role } from '../../users/entities/user-role.entity';

@Injectable()
export class AuthMapper {
  toCreateDto(userSignUpDto: UserSignUpDto): CreateUserDto {
    const userCreateDto = new CreateUserDto();
    userCreateDto.name = userSignUpDto.name;
    userCreateDto.username = userSignUpDto.username;
    userCreateDto.email = userSignUpDto.email;
    userCreateDto.password = userSignUpDto.password;
    userCreateDto.roles = [Role.USER];
    return userCreateDto;
  }
}
