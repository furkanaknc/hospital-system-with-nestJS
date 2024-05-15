import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AdminController } from './admin/admin.controller';
import { AdminModule } from './admin/admin.module';
import { PatientService } from './patient/patient.service';
import { PatientController } from './patient/patient.controller';
import { PatientModule } from './patient/patient.module';
import { DoctorModule } from './doctor/doctor.module';
import { ConfigModule } from '@nestjs/config';
import { SwaggerModule } from '@nestjs/swagger';
import { JwtService } from '@nestjs/jwt';
import { AuthModule } from './auth/auth.module';
import { AuthService } from './auth/auth.service';
import { ClinicModule } from './clinic/clinic.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AdminModule,
    PatientModule,
    DoctorModule,
    SwaggerModule,
    AuthModule,
    ClinicModule,
  ],
  controllers: [AppController, AdminController, PatientController],
  providers: [AppService, PatientService, JwtService, AuthService],
})
export class AppModule {}
