import {
  Controller,
  UseGuards,
  UnauthorizedException,
  NotFoundException,
  ConflictException,
  Param,
  Get,
  Req,
  Delete,
  Patch,
  Body,
} from '@nestjs/common';
import { JwtGuard } from 'src/auth/guards/jwt.guards';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Patient } from '@prisma/client';
import { PatientService } from './patient.service';
import { UpdatePatientDto } from './dto/updatePatient.dto';

@ApiTags('patient')
@Controller('patient')
export class PatientController {
  constructor(private readonly patientService: PatientService) {}
  @ApiBearerAuth()
  @ApiOperation({ summary: 'get' })
  @UseGuards(JwtGuard)
  @Get(':id')
  async getPatientByEmail(
    @Param('id') id: number,
    @Req() req: any,
  ): Promise<Patient> {
    if (id !== req.user.id || req.user.role !== 'patient') {
      console.log(req.user.id);
      throw new UnauthorizedException(
        'You are not authorized to access this user',
      );
    }
    const patient = await this.patientService.findPatientById(id);
    if (!patient) {
      throw new NotFoundException('User not found');
    }
    return patient;
  }

  //Bu method sayesinde bir 'admin' bütün 'patient'ları görebilir.
  @ApiBearerAuth()
  @ApiOperation({ summary: 'get all patients' })
  @UseGuards(JwtGuard)
  @Get()
  async getAllPatients(@Req() req: any): Promise<Patient[]> {
    const user = req.user;
    if (user && user.role === 'admin') {
      return this.patientService.getAllPatients();
    }
    throw new UnauthorizedException('Only admins can access all patients.');
  }

  //sadece adminler 'patiet' silebilecek.
  @ApiBearerAuth()
  @ApiOperation({ summary: 'delete patient' })
  @UseGuards(JwtGuard)
  @Delete(':id')
  async removePatient(@Req() req, @Param('id') id: string) {
    const patient = await this.patientService.findPatientById(Number(id));
    if (!patient) {
      throw new NotFoundException('Patient not found');
    }
    const user = req.user;
    if (!user || user.role !== 'admin') {
      throw new UnauthorizedException('Only admins can delete patients.');
    }
    return this.patientService.deletePatient(Number(id));
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'update patient' })
  @UseGuards(JwtGuard)
  @Patch(':id')
  async updatePatient(
    @Param('id') id: number,
    @Body() updatePatientDto: UpdatePatientDto,
    @Req() req: any,
  ): Promise<Patient> {
    try {
      const user = req.user;
      if (!user) {
        throw new UnauthorizedException('Invalid user');
      }
      const updatedPatient = await this.patientService.updatePatient(
        id,
        updatePatientDto,
        user,
      );
      if (!updatedPatient) {
        throw new NotFoundException('Patient not found');
      }
      return updatedPatient;
    } catch (error) {
      if (error.code === 'P2002' && error.meta && error.meta.target) {
        const target = error.meta.target;
        throw new ConflictException(`The ${target} is already in use`);
      } else {
        throw error;
      }
    }
  }
}
