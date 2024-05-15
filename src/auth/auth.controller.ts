import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AdminService } from 'src/admin/admin.service';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { CreatePatientDto } from 'src/patient/dto/createPatient.dto';
import { PatientService } from 'src/patient/patient.service';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly adminService: AdminService,
    private readonly patientService: PatientService,
  ) {}

  /*
  
  // bu methodu sisteme admin kullanıcı atamak için kullandım.
  // sizin de görebilmeniz için silmedim.
  @ApiOperation({ summary: 'register' })
  @Post('register')
  async registerAdmin(@Body() dto: CreateAdminDto) {
    return await this.adminService.create(dto);
  }

  */

  @ApiOperation({ summary: 'register' })
  @Post('register')
  async register(@Body() dto: CreatePatientDto) {
    return await this.patientService.createPatient(dto);
  }

  @ApiOperation({ summary: 'login' })
  @Post('login')
  async login(@Body() dto: LoginDto) {
    return await this.authService.login(dto);
  }
}
