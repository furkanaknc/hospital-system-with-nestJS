import { Module } from '@nestjs/common';
import { PatientController } from './patient.controller';
import { PatientService } from './patient.service';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [PatientController],
  providers: [PatientService, JwtService, PrismaService],
  exports: [PatientService, PrismaService],
})
export class PatientModule {}
