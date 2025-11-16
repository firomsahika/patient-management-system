import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PatientsModule } from './patients/patients.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { AppointmentsModule } from './appointments/appointments.module';
import { DoctorsModule } from './doctors/doctors.module';
import { DatabaseModule } from './database/database.module';
import { UsersService } from './users/users.service';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './auth/guards/roles.guards';

@Module({
  imports: [PatientsModule, UsersModule, AuthModule, AppointmentsModule, DoctorsModule, DatabaseModule],
  controllers: [AppController],
  providers: [AppService, UsersService,  {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },],
})
export class AppModule {}
