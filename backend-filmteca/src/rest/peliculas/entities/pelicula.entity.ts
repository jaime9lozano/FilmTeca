import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
  OneToMany,
} from 'typeorm';
import { Generos } from '../../generos/entities/genero.entity';
import { Actor } from '../../actor/entities/actor.entity';
import { Director } from '../../director/entities/director.entity';
import { Premio } from '../../premio/entities/premio.entity';
import { Valoracion } from '../../valoracion/entities/valoracion.entity';

@Entity('peliculas')
export class Pelicula {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text' })
  sinopsis: string;

  @Column({ type: 'int' })
  duration: number;

  @Column({ type: 'int' })
  release_year: number;

  @Column({ type: 'varchar', length: 100 })
  country_of_origin: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  music_by: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  photography_by: string;

  @Column({
    type: 'varchar',
    length: 255,
  })
  image: string;

  @ManyToMany(() => Generos, { eager: true }) // Relación muchos a muchos
  @JoinTable({
    name: 'genero_pelicula', // Nombre de la tabla intermedia
    joinColumn: { name: 'pelicula_id', referencedColumnName: 'id' }, // Columna que hace referencia a Pelicula
    inverseJoinColumn: { name: 'genero_id', referencedColumnName: 'id' }, // Columna que hace referencia a Generos
  })
  generos: Generos[];

  @ManyToMany(() => Actor, { eager: true }) // Relación muchos a muchos
  @JoinTable({
    name: 'actor_pelicula', // Nombre de la tabla intermedia
    joinColumn: { name: 'pelicula_id', referencedColumnName: 'id' }, // Columna que hace referencia a Pelicula
    inverseJoinColumn: { name: 'actor_id', referencedColumnName: 'id' }, // Columna que hace referencia a Generos
  })
  actores: Actor[];

  @ManyToMany(() => Director, { eager: true }) // Relación muchos a muchos
  @JoinTable({
    name: 'pelicula_directores', // Nombre de la tabla intermedia
    joinColumn: { name: 'pelicula_id', referencedColumnName: 'id' }, // Columna que hace referencia a Pelicula
    inverseJoinColumn: { name: 'director_id', referencedColumnName: 'id' }, // Columna que hace referencia a Generos
  })
  directores: Director[];

  @ManyToMany(() => Premio, { eager: true }) // Relación muchos a muchos
  @JoinTable({
    name: 'premio_pelicula', // Nombre de la tabla intermedia
    joinColumn: { name: 'pelicula_id', referencedColumnName: 'id' }, // Columna que hace referencia a Pelicula
    inverseJoinColumn: { name: 'premio_id', referencedColumnName: 'id' }, // Columna que hace referencia a Generos
  })
  premios: Premio[];

  @OneToMany(() => Valoracion, (valoracion) => valoracion.pelicula, {
    eager: true,
  })
  valoraciones: Valoracion[];

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
