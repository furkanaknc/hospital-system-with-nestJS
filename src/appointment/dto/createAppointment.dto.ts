import { IsNotEmpty, IsString, IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAppointmentDto {
  @ApiProperty({ description: 'Name of the appointment' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    description: 'ID of the doctor associated with the appointment',
  })
  @IsNotEmpty()
  @IsInt()
  doctorId: number;

  @ApiProperty({
    description: 'ID of the patient associated with the appointment',
  })
  @IsNotEmpty()
  @IsInt()
  patientId: number;

  @ApiProperty({
    description: 'ID of the clinic associated with the appointment',
  })
  @IsNotEmpty()
  @IsInt()
  clinicId: number;

  @ApiProperty({ description: 'Date and time of the appointment in UTC+3' })
  @IsNotEmpty()
  @IsString()
  date: string;
}
