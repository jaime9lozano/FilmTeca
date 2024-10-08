import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtAuthStrategy } from './strategies/jwt-strategies';
import { AuthMapper } from './mappers/usuarios.mapper';

@Module({
  imports: [
    // Configuración edl servicio de JWT
    JwtModule.register({
      // Lo voy a poner en base64
      secret: Buffer.from(
        process.env.TOKEN_SECRET || 'TokenSecreto',
        'utf-8',
      ).toString('base64'),
      signOptions: {
        expiresIn: Number(process.env.TOKEN_EXPIRES) || 3600, // Tiempo de expiracion
        algorithm: 'HS512', // Algoritmo de encriptacion
      },
    }),
    // Importamos el módulo de passport con las estrategias
    PassportModule.register({ defaultStrategy: 'jwt' }),
    // Importamos el módulo de usuarios porque usaremos su servicio
    UsersModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, AuthMapper, JwtAuthStrategy],
})
export class AuthModule {}
