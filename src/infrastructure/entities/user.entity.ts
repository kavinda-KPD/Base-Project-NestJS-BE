import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { RoleEntity } from './role.entity';

@Entity({ name: 'users' })
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', name: 'user_name', length: 255, unique: true })
  userName: string;

  @Column({ type: 'varchar', name: 'password', length: 255 })
  password: string;

  @ManyToOne(() => RoleEntity, (role) => role.users, { nullable: false })
  @JoinColumn({ name: 'role' })
  role: Partial<RoleEntity>;
}
