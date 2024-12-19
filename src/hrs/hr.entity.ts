import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CURRENT_TIMESTAMP } from 'utils/constants';
import { UserRole } from 'utils/enums';
@Entity('hrs')
export class Hr {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: '150' })
  fullName: string;

  @Column({ type: 'varchar', length: '250', unique: true })
  email: string;

  @Column({ type: 'varchar', length: '150', nullable: true })
  username: string;

  @Column({ select: false })
  password: string;
  @Column({ type: 'enum', enum: UserRole, default: UserRole.HR })
  userRole: UserRole;

  @CreateDateColumn({ type: 'timestamp', default: () => CURRENT_TIMESTAMP })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => CURRENT_TIMESTAMP,
    onUpdate: CURRENT_TIMESTAMP,
  })
  updatedAt: Date;
}
