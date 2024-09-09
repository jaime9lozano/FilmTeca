import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

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
