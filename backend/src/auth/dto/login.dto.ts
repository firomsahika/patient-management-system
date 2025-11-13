import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";



export class LoginDto {

  @IsNotEmpty()
  @IsString()
  @IsEmail({}, { message: 'Please enter a valid email address.' })
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters long.' })
  password: string;

}
