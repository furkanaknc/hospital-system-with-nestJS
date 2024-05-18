import { IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateClinicDto {
  @ApiProperty({ description: 'Name of the clinic' })
  @IsOptional()
  @IsString()
  name?: string;
}
