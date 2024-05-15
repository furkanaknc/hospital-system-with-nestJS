import { IsString, IsInt, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateClinicDto {
  @ApiProperty({ description: 'Name of the clinic' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ description: 'ID of the doctor associated with the clinic' })
  @IsOptional()
  @IsInt()
  doctorId?: number;

  @ApiProperty({ description: 'ID of the patient associated with the clinic' })
  @IsOptional()
  @IsInt()
  patientId?: number;
}
