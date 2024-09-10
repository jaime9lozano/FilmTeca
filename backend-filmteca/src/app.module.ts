import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PeliculasModule } from './rest/peliculas/peliculas.module';
import { CacheModule } from '@nestjs/cache-manager';
import { CorsConfigModule } from './config/cors/cors.module';
import { UsersModule } from './rest/users/users.module';
import { AuthModule } from './rest/auth/auth.module';
import { GenerosModule } from './rest/generos/generos.module';
import { DirectorModule } from './rest/director/director.module';
import { PremioModule } from './rest/premio/premio.module';
import { ActorModule } from './rest/actor/actor.module';

@Module({
  imports: [
    CacheModule.register(),
    TypeOrmModule.forRoot({
      type: process.env.DB_TYPE as 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT, 10),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      autoLoadEntities: process.env.DB_AUTOLOAD_ENTITIES === 'true',
      synchronize: process.env.DB_SYNCHRONIZE === 'true',
    }),
    UsersModule,
    AuthModule,
    PeliculasModule,
    CorsConfigModule,
    GenerosModule,
    DirectorModule,
    PremioModule,
    ActorModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
