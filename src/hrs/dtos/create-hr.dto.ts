import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateHrDto {
  @IsNotEmpty()
  @IsString()
  fullName: string;
  @IsNotEmpty()
  @IsEmail()
  email: string;
  @IsNotEmpty()
  @IsString()
  @MinLength(4)
  username: string;
  @IsNotEmpty()
  @MinLength(8)
  password: string;
}
