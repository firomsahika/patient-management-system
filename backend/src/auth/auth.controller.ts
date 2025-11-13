import { Body, Controller, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('register')
    async register(@Body() dto: CreateUserDto) {
        try {
            const user = await this.authService.register(dto);
            return {
                statusCode: HttpStatus.CREATED,
                message: 'User registered successfully',
                data: user,
            };
        } catch (error) {
           if(error.code === 'P2002'){
                return {
                    statusCode: HttpStatus.CONFLICT,
                    message: "User not registered"
                }
            }
            return {
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                message: "Internal server error"
            }
        }
    }

    @Post('login')
    async login(@Body() dto: LoginDto) {
        try {
            const result = await this.authService.login(dto.email, dto.password);
            return {
                statusCode: HttpStatus.OK,
                message: 'Login successful',
                data: result,
            };
        } catch (error) {
            // Handle known HTTP exceptions (like Unauthorized)
           if(error.code === 'P2002'){
                return {
                    statusCode: HttpStatus.CONFLICT,
                    message: "User with this email already exists"
                }
            }
            return {
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                message: "Internal server error"
            }
        }
    }
}
