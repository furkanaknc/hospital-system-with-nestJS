import { IsEmail, IsString, IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePatientDto {
  @ApiProperty({ description: 'patient first name' })
  @IsString()
  firstName: string;

  @ApiProperty({ description: 'patient last name' })
  @IsString()
  lastName: string;

  @ApiProperty({ description: 'patient email' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'patient password' })
  @IsString()
  password: string;

  @ApiProperty({ description: 'role', enum: ['patient'] })
  @IsString()
  @IsIn(['patient'])
  role: string = 'patient';
}
