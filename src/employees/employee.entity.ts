import { ClaimRequest } from 'src/claim/claim.entity';
import { CongeRequest } from 'src/leaves/conge-request.entity';
import { AugmentationRequest } from 'src/salary increase/salary-increase.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CURRENT_TIMESTAMP } from 'utils/constants';
import { UserRole } from 'utils/enums';
@Entity('employees')
export class Employee {
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
  @Column({ type: 'enum', enum: UserRole, default: UserRole.EMPLOYEE })
  userRole: UserRole;

  @CreateDateColumn({ type: 'timestamp', default: () => CURRENT_TIMESTAMP })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => CURRENT_TIMESTAMP,
    onUpdate: CURRENT_TIMESTAMP,
  })
  updatedAt: Date;
  @OneToMany(() => CongeRequest, (congeRequest) => congeRequest.employee, {
    cascade: true,
  })
  congeRequests: CongeRequest[];
  @OneToMany(
    () => AugmentationRequest,
    (augmentationRequest) => augmentationRequest.employee,
    {
      cascade: true,
    },
  )
  augmentationRequests: AugmentationRequest[];
  @OneToMany(() => ClaimRequest, (claimRequest) => claimRequest.employee)
  claimRequest: ClaimRequest[];
}
