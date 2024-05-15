import { Module } from '@nestjs/common';
import { ClinicController } from './clinic.controller';
import { ClinicService } from './clinic.service';

@Module({
  controllers: [ClinicController],
  providers: [ClinicService]
})
export class ClinicModule {}
