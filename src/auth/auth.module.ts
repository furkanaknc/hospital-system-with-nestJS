import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AdminService } from 'src/admin/admin.service';
import { PrismaService } from 'src/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { DoctorService } from 'src/doctor/doctor.service';
import { PatientService } from 'src/patient/patient.service';

@Module({
  providers: [
    AuthService,
    AdminService,
    PrismaService,
    JwtService,
    DoctorService,
    PatientService,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
