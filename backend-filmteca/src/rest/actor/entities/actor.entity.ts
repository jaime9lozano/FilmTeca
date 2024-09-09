import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Pelicula } from '../../peliculas/entities/pelicula.entity';

@Entity('actores')
export class Actor {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @ManyToMany(() => Pelicula, (pelicula) => pelicula.actores) // Relación inversa
  peliculas: Pelicula[];

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
