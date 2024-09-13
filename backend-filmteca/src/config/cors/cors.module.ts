import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';

@Module({})
export class CorsConfigModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply((req, res, next) => {
        const allowedOrigins = [
          'https://filmteca.netlify.app',
          'http://localhost:3000',
        ];
        const origin = req.headers.origin;

        if (allowedOrigins.includes(origin)) {
          res.header('Access-Control-Allow-Origin', origin);
        }

        res.header(
          'Access-Control-Allow-Methods',
          'GET, PATCH, POST, PUT, DELETE',
        );
        res.header(
          'Access-Control-Allow-Headers',
          'Origin, X-Requested-With, Content-Type, Accept, Authorization',
        );
        res.header('Access-Control-Allow-Credentials', 'true'); // Permitir credenciales

        if (req.method === 'OPTIONS') {
          res.sendStatus(204);
        } else {
          next();
        }
      })
      .forRoutes('*');
  }
}
