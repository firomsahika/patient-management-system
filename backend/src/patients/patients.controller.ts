import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put } from '@nestjs/common';
import { PatientsService } from './patients.service';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';

@Controller('patients')
export class PatientsController {
    constructor(private patientsService:PatientsService){}


    @Post('create')
    async createPatient(@Body() dto:CreatePatientDto){
        try {
            const patient = await this.patientsService.createPatient(dto);
            return {
                statusCode: HttpStatus.CREATED,
                message: "Patient created successdully!",
                data:patient
            }
        } catch (error) {
            if(error.code === 'P2002'){
                return {
                    statusCode: HttpStatus.CONFLICT,
                    message: "Patient with this name already exists"
                }
            }
            return {
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                message: "Internal server error"
            }
        }

    }

    @Get('all')
    async getAllUsers(){
       try {
          const patients = await this.patientsService.getAllPatients();
          return {
            statusCode: HttpStatus.OK,
            message: "Patients fetched successfuly!",
            data: patients
          }
       } catch (error) {
           if(error.code === 'P2002'){
                return {
                    statusCode: HttpStatus.CONFLICT,
                    message: "Patients does not exist"
                }
            }
            return {
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                message: "Internal server error"
            }
       }
    }


    @Get(':id')
    async getPatientById(@Param('id') id:string){
      try {
        const patient = await this.patientsService.getPatientById(Number(id));
        return {
            statusCode: HttpStatus.OK,
            message: "Single patient fetched successfully!",
            data:patient
        }
      } catch (error) {
        if(error.code === 'P2002'){
                return {
                    statusCode: HttpStatus.CONFLICT,
                    message: "Patient with this id does not exist"
                }
            }
            return {
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                message: "Internal server error"
            }
      }
    }


    @Put(':id')
    async updatePatient(@Param('id') id:string, @Body() dto:UpdatePatientDto){
        try {
            const updatedPatient = await this.patientsService.updatePatient(Number(id), dto);
            return {
                statusCode:HttpStatus.OK,
                message: "Patient updated successfully!",
                data: updatedPatient
            }
        } catch (error) {
            if(error.code === 'P2002'){
                return {
                    statusCode: HttpStatus.CONFLICT,
                    message: "Patient Update failed"
                }
            }
            return {
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                message: "Internal server error"
            }
        }
    }


    @Delete('id')
    async deletePatient(@Param('id') id:string){
       try {
          const deletedUser = await this.patientsService.deletePatientById(Number(id));
          return {
            statusCode: HttpStatus.OK,
            message: "Patient deleted successfully",
            data: deletedUser
          }
       } catch (error) {
          if(error.code === 'P2002'){
                return {
                    statusCode: HttpStatus.CONFLICT,
                    message: "Patient deletion failed"
                }
            }
            return {
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                message: "Internal server error"
            }
       }
    }
}
