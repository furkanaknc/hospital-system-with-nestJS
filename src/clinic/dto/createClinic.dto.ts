import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateClinicDto {
  @ApiProperty({ description: 'Name of the clinic' })
  @IsNotEmpty()
  @IsString()
  name: string;
}
