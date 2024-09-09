import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PeliculasModule } from './rest/peliculas/peliculas.module';
import { CacheModule } from '@nestjs/cache-manager';
import { CorsConfigModule } from './config/cors/cors.module';
import { UsersModule } from './rest/users/users.module';
import { AuthModule } from './rest/auth/auth.module';

@Module({
  imports: [
    CacheModule.register(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'aws-0-eu-central-1.pooler.supabase.com',
      port: 6543,
      username: 'postgres.sakcxgmlxeyvhautzyod',
      password: 'FilmTeca980-', // Asegúrate de reemplazar esto por tu contraseña
      database: 'postgres',
      autoLoadEntities: true,
      synchronize: false,
    }),
    UsersModule,
    AuthModule,
    PeliculasModule,
    CorsConfigModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
