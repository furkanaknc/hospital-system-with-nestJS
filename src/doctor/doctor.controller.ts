import {
  Controller,
  UseGuards,
  UnauthorizedException,
  NotFoundException,
  ConflictException,
  Param,
  Patch,
  Get,
  Req,
  Post,
  Body,
  Delete,
} from '@nestjs/common';
import { JwtGuard } from 'src/auth/guards/jwt.guards';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Doctor } from '@prisma/client';
import { DoctorService } from './doctor.service';
import { CreateDoctorDto } from './dto/createDoctor.dto';
import { UpdateDoctorDto } from './dto/updateDoctor.dto';

@ApiTags('doctor')
@Controller('doctor')
export class DoctorController {
  constructor(private readonly doctorService: DoctorService) {}
  @ApiBearerAuth()
  @ApiOperation({ summary: 'get' })
  @UseGuards(JwtGuard)
  @Get(':id')
  async getDoctoryEmail(
    @Param('id') id: number,
    @Req() req: any,
  ): Promise<Doctor> {
    if (id !== req.user.id || req.user.role !== 'doctor') {
      console.log(req.user.id);
      throw new UnauthorizedException(
        'You are not authorized to access this user',
      );
    }
    const doctor = await this.doctorService.findDoctorById(id);
    if (!doctor) {
      throw new NotFoundException('User not found');
    }
    return doctor;
  }

  // Bu method ile sadece adminler 'doctor' kullanıcı oluşturabiliyor
  // database modelinde atadığım 'role' özelliği sayesinde filtrelemem kolaylaştı.
  // 'register' methodu ile sisteme üye olan kullanıcılar sadece 'patient' rolunü alabilir olmalı ki sistemde hata olmasın.
  @ApiBearerAuth()
  @ApiOperation({ summary: 'create doctor' })
  @UseGuards(JwtGuard)
  @Post()
  async createDoctor(
    @Req() req: any,
    @Body() createDoctorDto: CreateDoctorDto,
  ): Promise<Doctor> {
    const user = req.user;
    if (user && user.role === 'admin') {
      return this.doctorService.createDoctor(createDoctorDto);
    }

    throw new UnauthorizedException('Only admins can create a doctor.');
  }

  //Bu method sayesinde bir 'admin' bütün doctorları görebilir.
  @ApiBearerAuth()
  @ApiOperation({ summary: 'update doctor' })
  @UseGuards(JwtGuard)
  @Patch(':id')
  async updateDoctor(
    @Param('id') id: number,
    @Body() updateDoctorDto: UpdateDoctorDto,
    @Req() req: any,
  ): Promise<Doctor> {
    try {
      const user = req.user;
      if (!user || !user.role) {
        throw new UnauthorizedException('Invalid user or user role missing');
      }
      const updatedDoctor = await this.doctorService.updateDoctor(
        id,
        updateDoctorDto,
        user.role,
      );
      if (!updatedDoctor) {
        throw new NotFoundException('Doctor not found');
      }
      return updatedDoctor;
    } catch (error) {
      if (error.code === 'P2002' && error.meta && error.meta.target) {
        const target = error.meta.target;
        throw new ConflictException(`The ${target} is already in use`);
      } else {
        throw error;
      }
    }
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'delete doctor' })
  @UseGuards(JwtGuard)
  @Delete(':id')
  async removeDoctor(@Req() req, @Param('id') id: string) {
    const doctor = await this.doctorService.findDoctorById(Number(id));
    if (!doctor) {
      throw new NotFoundException('Doctor not found');
    }
    const user = req.user;
    if (!user || user.role !== 'admin') {
      throw new UnauthorizedException('Only admins can delete doctors.');
    }
    return this.doctorService.deleteDoctor(Number(id));
  }
}
