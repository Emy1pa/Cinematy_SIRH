import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  Max,
  Min,
} from 'class-validator';

export class CreateSalaryIncreaseDto {
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @Max(10000, { message: "Le montant de l'augmentation est trop élevé." })
  increaseAmount: number;
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @Length(10, 150)
  justification?: string;
  @IsNotEmpty()
  @Type(() => Date)
  increaseDate: Date;

  validate() {
    const currentDate = new Date();
    if (this.increaseDate < currentDate) {
      throw new Error("La date d'augmentation doit être future.");
    }
  }
}
