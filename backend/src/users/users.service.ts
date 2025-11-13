import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  // Helper method to hide passwords
  private toResponse(user: any): UserResponseDto {
    const { password, ...safeData } = user;
    return safeData;
  }

  async createUser(dto: CreateUserDto): Promise<UserResponseDto> {
    try {
      const existingUser = await this.prisma.user.findUnique({
        where: { email: dto.email },
      });

      if (existingUser) {
        throw new ConflictException(`Email "${dto.email}" already exists.`);
      }

      const hashedPassword = await bcrypt.hash(dto.password, 10);
      const newUser = await this.prisma.user.create({
        data: { ...dto, password: hashedPassword },
      });

      return this.toResponse(newUser);
    } catch (error) {
      if (error instanceof ConflictException) throw error;
      throw new InternalServerErrorException('Failed to create user.');
    }
  }

  async getAllUsers(): Promise<UserResponseDto[]> {
    try {
      const users = await this.prisma.user.findMany();
      return users.map((user) => this.toResponse(user));
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch users.');
    }
  }

  async getUserById(id: number): Promise<UserResponseDto> {
    try {
      const user = await this.prisma.user.findUnique({ where: { id } });
      if (!user) throw new NotFoundException(`User with ID ${id} not found.`);
      return this.toResponse(user);
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Failed to fetch user.');
    }
  }

  async deleteUser(id: number): Promise<UserResponseDto> {
    try {
      const user = await this.prisma.user.findUnique({ where: { id } });
      if (!user) throw new NotFoundException(`User with ID ${id} not found.`);

      const deletedUser = await this.prisma.user.delete({ where: { id } });
      return this.toResponse(deletedUser);
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Failed to delete user.');
    }
  }

  async updateUser(id: number, dto: UpdateUserDto): Promise<UserResponseDto> {
    try {
      const user = await this.prisma.user.findUnique({ where: { id } });
      if (!user) throw new NotFoundException(`User with ID ${id} not found.`);

      // If password is being updated, hash it
      let updateData = { ...dto };
      if (dto.password) {
        updateData.password = await bcrypt.hash(dto.password, 10);
      }

      const updatedUser = await this.prisma.user.update({
        where: { id },
        data: updateData,
      });

      return this.toResponse(updatedUser);
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Failed to update user.');
    }
  }
}
