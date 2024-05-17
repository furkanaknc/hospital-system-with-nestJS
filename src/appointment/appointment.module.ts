import { Module } from '@nestjs/common';
import { AppointmentController } from './appointment.controller';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma.service';
import { AppointmentService } from './appointment.service';
import { DoctorModule } from 'src/doctor/doctor.module';
import { PatientModule } from 'src/patient/patient.module';
import { AdminModule } from 'src/admin/admin.module';
import { ClinicModule } from 'src/clinic/clinic.module';
import { PatientService } from 'src/patient/patient.service';
import { ClinicService } from 'src/clinic/clinic.service';
import { DoctorService } from 'src/doctor/doctor.service';
@Module({
  controllers: [AppointmentController],
  providers: [
    AppointmentService,
    JwtService,
    PrismaService,
    PatientService,
    ClinicService,
    DoctorService,
  ],
  imports: [
    JwtModule.register({ secret: process.env.jwtSecretKey }),
    DoctorModule,
    PatientModule,
    AdminModule,
    ClinicModule,
  ],
})
export class AppointmentModule {}
