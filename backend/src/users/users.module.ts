import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { DatabaseModule } from 'src/database/database.module';
import { RolesGuard } from 'src/auth/guards/roles.guards';
import { APP_GUARD } from '@nestjs/core/constants';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [UsersController],
  providers: [UsersService, 
    //  {
    //   provide: APP_GUARD,  
    //   useClass: RolesGuard,
    // },
  ],
  imports:[DatabaseModule, AuthModule],
})
export class UsersModule {}
