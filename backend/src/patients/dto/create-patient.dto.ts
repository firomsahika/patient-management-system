import { IsInt, IsNotEmpty, IsString } from "class-validator";

export class CreatePatientDto{
   @IsString()
   @IsNotEmpty()
   name:string

   @IsInt()
   @IsNotEmpty()
   age:number

   @IsNotEmpty()
   gender:string

   @IsString()
   @IsNotEmpty()
   adress:string

   @IsString()
   @IsNotEmpty()
   phone:string

}