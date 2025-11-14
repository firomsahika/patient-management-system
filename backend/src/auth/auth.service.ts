    import { Injectable, ConflictException, UnauthorizedException, InternalServerErrorException } from '@nestjs/common';
    import { PrismaService } from 'src/database/prisma.service';
    import { CreateUserDto } from 'src/users/dto/create-user.dto';
    import { JwtService } from '@nestjs/jwt';
    import * as bcrypt from 'bcrypt';
    import { UserResponseDto } from 'src/users/dto/user-response.dto';
    import { Subject } from 'rxjs';

    @Injectable()
    export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService,
    ) {}

    private toResponse(user:any){
        const {password, ...safeData} = user;
        return safeData;
    }

    // REGISTER USER
    async register(dto: CreateUserDto): Promise<UserResponseDto> {
        try {
        const existingUser = await this.prisma.user.findUnique({ where: { email: dto.email } });
        if (existingUser) {
            throw new ConflictException(`Email "${dto.email}" is already registered.`);
        }

        const hashedPassword = await bcrypt.hash(dto.password, 10);
        const newUser = await this.prisma.user.create({
            data: { ...dto, password: hashedPassword },
        });

        // Remove password from response
        return this.toResponse(newUser);
        } catch (error) {
        if (error instanceof ConflictException) throw error;
        throw new InternalServerErrorException('Failed to register user.');
        }
    }

    // LOGIN USER
    async login(email: string, password: string):Promise<{ accessToken: string; user: UserResponseDto }> {
        try {
        const user = await this.prisma.user.findUnique({ where: { email } });
        if (!user) {
            throw new UnauthorizedException('User with this email doesnot exist!');
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            throw new UnauthorizedException('Password does not match!');
        }

        const payload = { subject: user.id, email: user.email, role: user.role };
        const token = this.jwtService.sign(payload, {
            secret: process.env.JWT_SECRET,
            expiresIn: '1h',
        });

        return { accessToken: token, user: this.toResponse(user) };
        } catch (error) {
        if (error instanceof UnauthorizedException) throw error;
        throw new InternalServerErrorException('Login failed.');
        }
    }
    }
