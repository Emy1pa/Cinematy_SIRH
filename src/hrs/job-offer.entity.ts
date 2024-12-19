import {
  IsArray,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CURRENT_TIMESTAMP } from 'utils/constants';
import { ExperienceLevel, JobType } from 'utils/enums';
@Entity('offers')
export class Offer {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  @IsString()
  title: string;
  @Column('text')
  @IsString()
  description: string;
  @Column()
  @IsString()
  location: string;
  @Column({ type: 'enum', enum: JobType })
  @IsEnum(JobType)
  jobType: JobType;
  @Column({
    type: 'enum',
    enum: ExperienceLevel,
  })
  @IsEnum(ExperienceLevel)
  experienceLevel: ExperienceLevel;
  @Column('decimal', { precision: 10, scale: 2 })
  @IsNumber()
  salaryRange: number;
  @Column('text', { nullable: true })
  requiredSkills?: string;
  @Column({ nullable: true })
  @IsOptional()
  imageUrl?: string;
  @CreateDateColumn({ type: 'timestamp', default: () => CURRENT_TIMESTAMP })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => CURRENT_TIMESTAMP,
    onUpdate: CURRENT_TIMESTAMP,
  })
  updatedAt: Date;
}
