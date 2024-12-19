import { Employee } from 'src/employees/employee.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { CongeStatus } from 'utils/enums';

@Entity()
export class CongeRequest {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  startDate: Date;
  @Column()
  endDate: Date;
  @Column({
    type: 'enum',
    enum: CongeStatus,
    default: CongeStatus.PENDING,
  })
  status: CongeStatus;
  @Column({ nullable: true })
  reason: string;
  @ManyToOne(() => Employee, (employee) => employee.congeRequests, {
    onDelete: 'CASCADE',
  })
  employee: Employee;
}
