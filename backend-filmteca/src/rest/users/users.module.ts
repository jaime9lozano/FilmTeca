import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { CacheModule } from '@nestjs/cache-manager';
import { UserRole } from './entities/user-role.entity';
import { Usuario } from './entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuariosMapper } from './mapper/users.mapper';
import { BcryptService } from './bcrypt.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Usuario]), // Importamos el repositorio de usuarios
    TypeOrmModule.forFeature([UserRole]), // Importamos el repositorio de roles
    CacheModule.register(), // Importamos el módulo de cache
  ],
  controllers: [UsersController],
  providers: [UsersService, UsuariosMapper, BcryptService],
  exports: [UsersService],
})
export class UsersModule {}
