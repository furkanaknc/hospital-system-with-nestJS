import { IsEmail, IsString, IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateDoctorDto {
  @ApiProperty({ description: 'doctor first name' })
  @IsString()
  firstName: string;

  @ApiProperty({ description: 'doctor last name' })
  @IsString()
  lastName: string;

  @ApiProperty({ description: 'doctor email' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'doctor password' })
  @IsString()
  password: string;

  @ApiProperty({ description: 'role', enum: ['doctor'] })
  @IsString()
  @IsIn(['doctor'])
  role: string = 'doctor';
}
