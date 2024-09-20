import { Injectable } from '@nestjs/common';
import { Pelicula } from '../peliculas/entities/pelicula.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Usuario } from '../users/entities/user.entity';
import { Favorito } from './entities/favorito.entity';
import {
  FilterOperator,
  FilterSuffix,
  paginate,
  PaginateQuery,
} from 'nestjs-paginate';

@Injectable()
export class FavoritoService {
  constructor(
    @InjectRepository(Favorito)
    private favoritoRepository: Repository<Favorito>,
    @InjectRepository(Usuario)
    private usuarioRepository: Repository<Usuario>,
    @InjectRepository(Pelicula)
    private peliculaRepository: Repository<Pelicula>,
  ) {}

  async isPeliculaFavorita(
    userId: number,
    peliculaId: number,
  ): Promise<boolean> {
    const favorito = await this.favoritoRepository.findOne({
      where: {
        usuario: { id: userId },
        pelicula: { id: peliculaId },
      },
    });

    return favorito !== null; // Retorna true si existe, false si no
  }

  async addFavorito(userId: number, peliculaId: number): Promise<Favorito> {
    const usuario = await this.usuarioRepository.findOneBy({ id: userId });
    const pelicula = await this.peliculaRepository.findOneBy({
      id: peliculaId,
    });

    if (!usuario || !pelicula) {
      throw new Error('Usuario o película no encontrada');
    }

    const favorito = new Favorito();
    favorito.usuario = usuario;
    favorito.pelicula = pelicula;

    return this.favoritoRepository.save(favorito);
  }

  async removeFavorito(userId: number, peliculaId: number): Promise<void> {
    const result = await this.favoritoRepository.delete({
      usuario: { id: userId }, // Referencia a la relación
      pelicula: { id: peliculaId }, // Referencia a la relación
    });

    if (result.affected === 0) {
      throw new Error('Favorito no encontrado');
    }
  }

  async getFavoritosByUser(userId: number): Promise<any> {
    const queryBuilder = this.favoritoRepository
      .createQueryBuilder('favorito')
      .innerJoin('favorito.usuario', 'usuario') // Unir con la tabla de usuarios
      .innerJoinAndSelect('favorito.pelicula', 'pelicula') // Unir con la tabla de películas y seleccionar los datos
      .where('usuario.id = :userId', { userId }) // Filtrar por el id del usuario
      .andWhere('pelicula.deletedAt IS NULL'); // Filtrar por los favoritos que no han sido eliminados

    const favoritos = await queryBuilder.getMany();

    // Devolver solo la información de la película
    return favoritos.map((favorito) => favorito.pelicula);
  }
}
