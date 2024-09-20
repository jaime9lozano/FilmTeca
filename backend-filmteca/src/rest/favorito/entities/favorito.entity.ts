import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Usuario } from '../../users/entities/user.entity';
import { Pelicula } from '../../peliculas/entities/pelicula.entity';

@Entity('favoritos')
export class Favorito {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @ManyToOne(() => Usuario, (usuario) => usuario.favoritos, { eager: true })
  @JoinColumn({ name: 'user_id' })
  usuario: Usuario;

  @ManyToOne(() => Pelicula, (pelicula) => pelicula.favoritos, { eager: true })
  @JoinColumn({ name: 'pelicula_id' })
  pelicula: Pelicula;
}
