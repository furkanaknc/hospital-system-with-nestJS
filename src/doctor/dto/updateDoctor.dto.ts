import { IsEmail, IsString, IsIn, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateDoctorDto {
  @ApiProperty({ description: 'doctor first name' })
  @IsString()
  @IsOptional()
  firstName?: string;

  @ApiProperty({ description: 'doctor last name' })
  @IsString()
  @IsOptional()
  lastName?: string;

  @ApiProperty({ description: 'doctor email' })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({ description: 'doctor password' })
  @IsString()
  @IsOptional()
  password?: string;

  @ApiProperty({ description: 'role', enum: ['doctor'] })
  @IsString()
  @IsIn(['doctor'])
  role: string = 'doctor';
}
