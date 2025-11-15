import { ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { CreatePatientDto } from './dto/create-patient.dto';
import { PatientResponseDto } from './dto/patient-response.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';

@Injectable()
export class PatientsService {
  constructor(private prisma: PrismaService) { }



  async createPatient(dto: CreatePatientDto): Promise<PatientResponseDto> {
    try {
      const existingPatient = await this.prisma.patient.findUnique({
        where: { name: dto.name },
      });

      if (existingPatient) {
        throw new ConflictException(
          `Patient with name "${dto.name}" already exists.`,
        );
      }

      const newPatient = await this.prisma.patient.create({
        data: dto,
      });

      return this.toPatientResponse(newPatient);
    } catch (error) {
      throw error; // ❗ important
    }
  }


  async getAllPatients(): Promise<PatientResponseDto[]> {
    try {
      const patients = await this.prisma.patient.findMany();
      return patients.map((patient) => this.toPatientResponse(patient));
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch patients.')
    }
  }

  async getPatientById(id: number):Promise<PatientResponseDto | null>{
    try{
      const patient = await this.prisma.patient.findUnique({where:{id}}); 
      return patient ? this.toPatientResponse(patient) :  null;
    } catch(error){
      throw new InternalServerErrorException('Failed to fetch patient by ID.')
    }
  }

  async deletePatientById(id: number): Promise<void> {
  try {
    await this.prisma.patient.delete({
      where: { id },
    });
  } catch (error) {
    // If the record does not exist
    if (error.code === 'P2025') {
      throw new NotFoundException(`Patient with ID ${id} not found`);
    }
    throw new InternalServerErrorException(
      'Failed to delete patient by ID.',
    );
  }

}


  async updatePatient(id:number, dto:UpdatePatientDto): Promise<PatientResponseDto>{
     try {
      const patient = await this.prisma.patient.findUnique({where:{id}});
      if(!patient){
        throw new NotFoundException(`Patient with ID ${id} not found`);
      }

      const updatedPatient = await this.prisma.patient.update({
        where:{id},
        data:{...dto}
      })

      return this.toPatientResponse(updatedPatient);
     } catch (error) {
        throw new InternalServerErrorException("Failed to update patient.");
     }
  }

   // Helper function to map patient entity to response DTO
  private toPatientResponse(patient: any): PatientResponseDto {
    return {
      id: patient.id,
      name: patient.name,
      age: patient.age,
      gender: patient.gender,
      address: patient.address,
      phone: patient.phone,
    };
  }


  
}



 

