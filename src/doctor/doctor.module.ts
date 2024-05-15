import { Module } from '@nestjs/common';
import { DoctorController } from './doctor.controller';
import { DoctorService } from './doctor.service';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [DoctorController],
  providers: [DoctorService, JwtService, PrismaService],
  exports: [DoctorService, PrismaService],
})
export class DoctorModule {}
