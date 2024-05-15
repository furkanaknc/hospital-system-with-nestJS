import { Module } from '@nestjs/common';
import { ClinicController } from './clinic.controller';
import { ClinicService } from './clinic.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma.service';
import { DoctorModule } from 'src/doctor/doctor.module';
import { PatientModule } from 'src/patient/patient.module';
import { AdminModule } from 'src/admin/admin.module';

@Module({
  controllers: [ClinicController],
  providers: [ClinicService, JwtService, PrismaService],
  imports: [
    JwtModule.register({
      secret: process.env.jwtSecretKey,
    }),
    DoctorModule,
    PatientModule,
    AdminModule,
  ],
})
export class ClinicModule {}
