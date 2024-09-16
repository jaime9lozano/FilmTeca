import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserRole } from './user-role.entity';
import { Valoracion } from '../../valoracion/entities/valoracion.entity';

@Entity({ name: 'users' }) // Nombre de la tabla (es case sensitive!!!)
export class Usuario {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ type: 'varchar', length: 255, nullable: false })
  name: string;

  @Column({ type: 'varchar', length: 255, nullable: false, unique: true })
  email: string;

  @Column({ unique: true, length: 255, nullable: false })
  username: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  password: string;

  @OneToMany(() => Valoracion, (valoracion) => valoracion.user, {
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

  // Con el eager: true, cuando hagamos un find, nos traerá también los roles ahorrando una consulta (compo hicimos en producto con la categoría)
  @OneToMany(() => UserRole, (userRole) => userRole.usuario, { eager: true })
  roles: UserRole[];

  // get roleNames(): string[] {
  //  return this.roles.map((role) => role.role)
  // }
}
