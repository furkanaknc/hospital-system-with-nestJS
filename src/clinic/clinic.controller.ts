import {
  Controller,
  UseGuards,
  UnauthorizedException,
  NotFoundException,
  Get,
  Post,
  Patch,
  Delete,
  Req,
  Body,
  Param,
} from '@nestjs/common';
import { ApiOperation, ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from 'src/auth/guards/jwt.guards';
import { Clinic } from '@prisma/client';
import { ClinicService } from './clinic.service';
import { CreateClinicDto } from './dto/createClinic.dto';
import { UpdateClinicDto } from './dto/updateClinic.dto';

@ApiTags('clinic')
@Controller('clinic')
export class ClinicController {
  constructor(private readonly clinicService: ClinicService) {}

  @ApiBearerAuth()
  @ApiOperation({ summary: 'get all clinics' })
  @UseGuards(JwtGuard)
  @Get()
  async getAllDoctors(@Req() req: any): Promise<Clinic[]> {
    const user = req.user;
    if (user && user.role === 'admin') {
      return this.clinicService.getAllClinics();
    }
    throw new UnauthorizedException('Only admins can access all clinics.');
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'create clinic' })
  @UseGuards(JwtGuard)
  @Post()
  async createClinic(
    @Req() req: any,
    @Body() createClinicDto: CreateClinicDto,
  ): Promise<Clinic> {
    const user = req.user;
    if (user && user.role === 'admin') {
      return this.clinicService.createClinic(createClinicDto);
    }
    throw new UnauthorizedException('Only admins can create a clinic.');
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'delete clinics' })
  @UseGuards(JwtGuard)
  @Delete(':id')
  async removeClinic(@Req() req, @Param('id') id: string) {
    const clinic = await this.clinicService.findClinicById(Number(id));
    if (!clinic) {
      throw new NotFoundException('Clinic not found');
    }
    const user = req.user;
    if (!user || user.role !== 'admin') {
      throw new UnauthorizedException('Only admins can delete clinics.');
    }
    return this.clinicService.deleteClinic(Number(id));
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'update clinic' })
  @UseGuards(JwtGuard)
  @Patch(':id')
  async updateClinic(
    @Param('id') id: number,
    @Body() updateClinicDto: UpdateClinicDto,
    @Req() req: any,
  ): Promise<Clinic> {
    const user = req.user;
    if (user && user.role === 'admin') {
      const updatedClinic = await this.clinicService.updateClinic(
        id,
        updateClinicDto,
      );
      if (!updatedClinic) {
        throw new NotFoundException(`Clinic with ID ${id} not found`);
      }
      return updatedClinic;
    }
    throw new UnauthorizedException('Only admins can update a clinic.');
  }
}
