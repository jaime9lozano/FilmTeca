import {
  Controller,
  Get,
  Post,
  Param,
  Delete,
  UseGuards,
  Body,
  Query,
} from '@nestjs/common';
import { FavoritoService } from './favorito.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles, RolesAuthGuard } from '../auth/guards/roles-auth.guard';

@Controller('favoritos')
@UseGuards(JwtAuthGuard, RolesAuthGuard)
@Roles('USER')
export class FavoritoController {
  constructor(private readonly favoritoService: FavoritoService) {}

  // Endpoint para verificar si una película es favorita
  @Get('es-favorita')
  async isPeliculaFavorita(
    @Query('userId') userId: number,
    @Query('peliculaId') peliculaId: number,
  ): Promise<{ isFavorita: boolean }> {
    const isFavorita = await this.favoritoService.isPeliculaFavorita(
      userId,
      peliculaId,
    );
    return { isFavorita };
  }

  @Post('add')
  addFavorito(
    @Body('userId') userId: number,
    @Body('peliculaId') peliculaId: number,
  ) {
    return this.favoritoService.addFavorito(userId, peliculaId);
  }

  @Delete('remove')
  removeFavorito(
    @Body('userId') userId: number,
    @Body('peliculaId') peliculaId: number,
  ) {
    return this.favoritoService.removeFavorito(userId, peliculaId);
  }

  @Get('user/:userId')
  getFavoritosByUser(@Param('userId') userId: number) {
    return this.favoritoService.getFavoritosByUser(userId);
  }
}
