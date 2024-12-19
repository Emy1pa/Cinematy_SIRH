import { Transform } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { ExperienceLevel, JobType } from 'utils/enums';

export class CreateJobOfferDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsString()
  location: string;

  @IsEnum(JobType)
  jobType: JobType;

  @IsEnum(ExperienceLevel)
  experienceLevel: ExperienceLevel;

  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  salaryRange: number;

  @IsOptional()
  @IsString()
  requiredSkills?: string;

  @IsOptional()
  @IsString()
  imageUrl?: string;
}
