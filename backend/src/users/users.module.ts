import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { DatabaseModule } from 'src/database/database.module';
import { RolesGuard } from 'src/auth/guards/roles.guards';
import { APP_GUARD } from '@nestjs/core/constants';

@Module({
  controllers: [UsersController],
  providers: [UsersService,
     {
      provide: APP_GUARD,
      useClass: RolesGuard, // optional: make it global
    },
  ],
  imports:[DatabaseModule],
})
export class UsersModule {}
