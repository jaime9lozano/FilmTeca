import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Pelicula } from '../../peliculas/entities/pelicula.entity';

@Entity('generos')
export class Generos {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @ManyToMany(() => Pelicula, (pelicula) => pelicula.generos) // Relación inversa
  peliculas: Pelicula[];

  @Column({
    name: 'deleted_at',
    type: 'timestamp',
    nullable: true, // Permitimos nulos, ya que solo se rellenará cuando se elimine
  })
  deletedAt: Date | null;
}
