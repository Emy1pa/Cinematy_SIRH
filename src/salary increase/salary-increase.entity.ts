import { Employee } from 'src/employees/employee.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { AugmentationStatus } from 'utils/enums';

@Entity()
export class AugmentationRequest {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  increaseAmount: number;
  @Column({ nullable: true, type: 'text' })
  justification?: string;
  @Column({ type: 'date' })
  increaseDate: Date;
  @Column({
    type: 'enum',
    enum: AugmentationStatus,
    default: AugmentationStatus.PENDING,
  })
  status: AugmentationStatus;
  @ManyToOne(() => Employee, (employee) => employee.augmentationRequests, {
    onDelete: 'CASCADE',
  })
  employee: Employee;
}
