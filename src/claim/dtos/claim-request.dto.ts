import {
  IsEnum,
  IsNotEmpty,
  IsString,
  Length,
  MaxLength,
} from 'class-validator';
import { claimCategory } from 'utils/enums';

export class CreateClaimRequestDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(150)
  title: string;
  @IsNotEmpty()
  @IsString()
  @MaxLength(250)
  description: string;
  @IsNotEmpty()
  @IsEnum(claimCategory, {
    message: `category must be one of the following values: ${Object.values(claimCategory).join(', ')}`,
  })
  category: claimCategory;
}
