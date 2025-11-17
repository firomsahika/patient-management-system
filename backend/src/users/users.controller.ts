import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post, Put, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { stat } from 'fs';
import { single } from 'rxjs';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { RolesGuard } from 'src/auth/guards/roles.guards';

@Controller('users')
export class UsersController {
    constructor(private userService:UsersService){}

   
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.admin)
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

    @Put(':id')
    async updateUser(@Param('id') id: string, @Body() dto: UpdateUserDto) {
       try {
         const updatedUser =  await this.userService.updateUser(Number(id), dto)
         return {
            statusCode: HttpStatus.OK,
            message: "User updated succesfully!",
            data: updatedUser
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

    @Delete(':id')
    async deleteUser(@Param('id') id: string){
        try {
            const deletedUser = await this.userService.deleteUser(Number(id));
            return {
                statusCode: HttpStatus.OK,
                message: "User deleted succesfully!",
                data: deletedUser
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
                message: "Internal server error"
            }
        }
    }
}
