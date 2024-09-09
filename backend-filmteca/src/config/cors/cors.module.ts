import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';

@Module({})
export class CorsConfigModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply((req, res, next) => {
        res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
        res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
        res.header(
          'Access-Control-Allow-Headers',
          'Origin, X-Requested-With, Content-Type, Accept',
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
