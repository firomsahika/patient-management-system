import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class UpdatePatientDto {

  @IsString()
  name?: string;

  @IsString()
  age?: number;

  @IsString()
  gender?: string;

  @IsString()
  address?: string;

  @IsString()
  phone?: string;
}
