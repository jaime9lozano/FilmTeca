import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Pelicula } from '../../peliculas/entities/pelicula.entity';
import { Usuario } from '../../users/entities/user.entity';

@Entity('valoraciones')
export class Valoracion {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ type: 'text' })
  review: string;

  @Column({ type: 'float' })
  rating: number;

  @ManyToOne(() => Pelicula, (pelicula) => pelicula.valoraciones)
  pelicula: Pelicula;

  @ManyToOne(() => Usuario, (usuario) => usuario.valoraciones)
  user: Usuario;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  @Column({
    name: 'deleted_at',
    type: 'timestamp',
    nullable: true, // Permitimos nulos, ya que solo se rellenará cuando se elimine
  })
  deletedAt: Date | null;
}
