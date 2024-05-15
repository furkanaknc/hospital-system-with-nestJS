import { IsEmail, IsString, IsIn, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdatePatientDto {
  @ApiProperty({ description: 'patient first name' })
  @IsString()
  @IsOptional()
  firstName?: string;

  @ApiProperty({ description: 'patient last name' })
  @IsString()
  @IsOptional()
  lastName?: string;

  @ApiProperty({ description: 'patient email' })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({ description: 'patient password' })
  @IsString()
  @IsOptional()
  password?: string;

  @ApiProperty({ description: 'role', enum: ['patient'] })
  @IsString()
  @IsIn(['patient'])
  role: string = 'patient';
}
