import { IsNotEmpty, IsString, IsOptional, IsEmail, MinLength } from 'class-validator';

export class CreateUserDto {
    @IsNotEmpty()
    @IsString()
    name: string;

     @IsEmail({}, { message: 'Please enter a valid email address.' })
    email: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(6, { message: 'Password must be at least 6 characters long.' })
    password: string;

    @IsOptional()
    @IsString()
    role? : string;

}