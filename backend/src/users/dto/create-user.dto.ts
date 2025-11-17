import { IsNotEmpty, IsString, IsOptional, IsEmail, MinLength, IsEnum } from 'class-validator';
import {Role} from "@prisma/client"


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

    @IsNotEmpty()
    @IsEnum(Role, { message: 'Role must be one of the following: admin, doctor, nurse, patient.' })
    role:Role;

}