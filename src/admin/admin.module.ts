import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { PrismaService } from 'src/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { AdminController } from './admin.controller';

@Module({
  providers: [AdminService, PrismaService, JwtService],
  controllers: [AdminController],
  exports: [AdminService, PrismaService],
})
export class AdminModule {}
