import { Employee } from 'src/employees/employee.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { claimCategory, ClaimStatus } from 'utils/enums';

@Entity()
export class ClaimRequest {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ type: 'varchar', length: 150 })
  title: string;
  @Column({ type: 'varchar', length: 250 })
  description: string;
  @Column({ type: 'enum', enum: claimCategory, default: claimCategory.OTHER })
  category: string;
  @Column({ type: 'enum', enum: ClaimStatus, default: ClaimStatus.PENDING })
  status: string;
  @ManyToOne(() => Employee, (employee) => employee.claimRequest)
  employee: Employee;
}
