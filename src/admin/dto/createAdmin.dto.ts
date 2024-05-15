import { IsEmail, IsString, IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAdminDto {
  @ApiProperty({ description: 'admin email' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'admin first name' })
  @IsString()
  firstName: string;

  @ApiProperty({ description: 'admin last name' })
  @IsString()
  lastName: string;

  @ApiProperty({ description: 'admin password' })
  @IsString()
  password: string;

  @ApiProperty({ description: 'role', enum: ['admin'] })
  @IsString()
  @IsIn(['admin'])
  role: string = 'admin';
}
