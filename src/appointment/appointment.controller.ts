import {
  Controller,
  UnauthorizedException,
  UseGuards,
  Post,
  Body,
  Req,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtGuard } from 'src/auth/guards/jwt.guards';
import { AppointmentService } from './appointment.service';
import { CreateAppointmentDto } from './dto/createAppointment.dto';

@ApiTags('appointment')
@Controller('appointment')
export class AppointmentController {
  constructor(private readonly appointmentService: AppointmentService) {}

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create an appointment' })
  @UseGuards(JwtGuard)
  @Post()
  async createAppointment(
    @Req() req: any,
    @Body() createAppointmentDto: CreateAppointmentDto,
  ) {
    const user = req.user;
    if (!user || (user.role !== 'admin' && user.role !== 'patient')) {
      throw new UnauthorizedException(
        'Only admins or patients can create appointments.',
      );
    }

    if (user.role === 'patient' && createAppointmentDto.patientId !== user.id) {
      throw new UnauthorizedException(
        'Patients can only create appointments for themselves.',
      );
    }

    return this.appointmentService.createAppointment(createAppointmentDto);
  }
}
