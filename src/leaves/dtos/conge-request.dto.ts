import { Type } from 'class-transformer';
import { IsDate, IsNotEmpty, IsOptional, Length } from 'class-validator';

export class CreateCongeRequestDto {
  @IsNotEmpty({ message: 'La date de début est requise.' })
  @Type(() => Date)
  @IsDate({ message: 'La date de début doit être une date valide.' })
  startDate: Date;

  @IsNotEmpty({ message: 'La date de fin est requise.' })
  @Type(() => Date)
  @IsDate({ message: 'La date de fin doit être une date valide.' })
  endDate: Date;

  @IsOptional()
  @Length(3, 500, {
    message: 'La raison doit contenir entre 3 et 500 caractères.',
  })
  reason?: string;

  // Custom validation to ensure end date is after start date
  validate() {
    if (this.startDate && this.endDate && this.startDate > this.endDate) {
      throw new Error(
        'La date de fin doit être postérieure à la date de début.',
      );
    }
  }
}
