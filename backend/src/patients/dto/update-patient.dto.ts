import { IsEmail, IsNumber, IsOptional, IsString, MinLength } from 'class-validator';

export class UpdatePatientDto {

  @IsString()
  name?: string;

  @IsNumber()
  age?: number;

  @IsString()
  gender?: string;

  @IsString()
  address?: string;

  @IsString()
  phone?: string;
}
