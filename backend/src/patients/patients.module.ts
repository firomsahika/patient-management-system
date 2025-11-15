import { Module } from '@nestjs/common';
import { PatientsController } from './patients.controller';
import { PatientsService } from './patients.service';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  controllers: [PatientsController],
  providers: [PatientsService],
  imports: [DatabaseModule]
})
export class PatientsModule {}
