import { Body, Controller, Get, HttpException, HttpStatus, Param, Post, Put } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { stat } from 'fs';
import { single } from 'rxjs';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/user-response.dto';

@Controller('users')
export class UsersController {
    constructor(private userService:UsersService){}

    @Post('create')
    async createUser(@Body() dto:CreateUserDto){
        try {
            const user = await this.userService.createUser(dto)
            return {
                statusCode: HttpStatus.CREATED,
                message: "User created succesfully!",
                data: user
            }
        } catch (error) {
            if(error.code === 'P2002'){
                return {
                    statusCode: HttpStatus.CONFLICT,
                    message: "User with this email already exists"
                }
            }
            return {
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                message: "Internal server erro"
            }
        }
    }

    @Get('all')
    async getAllUsers(){
        try {
            const users = await this.userService.getAllUsers();
            return {
                statusCode: HttpStatus.OK,
                message: "Users fetched succesfully",
                data: users
            }
        } catch (error) {
            if(error.code === 'P2002'){
                return {
                    statusCode: HttpStatus.CONFLICT,
                    message: "User with this email already exists"
                }
            }
            return {
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                message: "Internal server erro"
            }
            
        }
    }

    @Get(':id')
    async getUserById(@Param('id') id: string){
        try {
            const singleUser = await this.userService.getUserById(Number(id));
            return {
                statusCode: HttpStatus.OK,
                message: "User fetched succesfully!",
                data: singleUser
            }
        } catch (error) {
            
        }
    }

    @Put(':id')
    async updateUser(@Param('id') id: string, @Body() dto: UpdateUserDto): Promise<UserResponseDto> {
       try {
         return await this.userService.updateUser(Number(id), dto)
       } catch (error) {
           throw new HttpException(
        error.message || 'Failed to update user',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
       }
    
}
