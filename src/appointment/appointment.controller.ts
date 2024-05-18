import {
  Controller,
  UnauthorizedException,
  UseGuards,
  Post,
  Body,
  Req,
  NotFoundException,
  Delete,
  ForbiddenException,
  Param,
  Get,
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

    //kimse geçmiş tarihe randevu oluşturamamalı
    const appointmentDate = new Date(createAppointmentDto.date);
    const now = new Date();
    if (appointmentDate < now) {
      throw new ForbiddenException('Cannot create an appointment in the past.');
    }

    return this.appointmentService.createAppointment(createAppointmentDto);
  }

  // delete için tek bir api'de hem patient hem admin hem de doctor'u yapmanın daha verimsiz olduğunu düşündüm

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete an appointment' })
  @UseGuards(JwtGuard)
  @Delete('patient/:id')
  async deleteAppointmentForPatient(@Req() req: any, @Param('id') id: number) {
    const user = req.user;

    const appointment = await this.appointmentService.getAppointmentById(id);

    if (!appointment) {
      throw new NotFoundException('Appointment not found.');
    }

    if (user.role !== 'patient') {
      throw new UnauthorizedException('Only patients can use this API.');
    }

    if (appointment.patientId !== user.id) {
      throw new UnauthorizedException(
        'Patients can only delete their own appointments.',
      );
    }

    const appointmentDate = new Date(appointment.date);
    const now = new Date();
    const nowUTCPlus3 = new Date(now.getTime() + 3 * 60 * 60 * 1000);
    const timeDifference = appointmentDate.getTime() - nowUTCPlus3.getTime();
    const oneHour = 60 * 60 * 1000;

    //geçmiş randevularını silememeli.
    if (appointmentDate < nowUTCPlus3) {
      throw new ForbiddenException('Cannot delete a past appointment.');
    }

    if (timeDifference <= oneHour) {
      throw new ForbiddenException(
        'Patients can only delete their own appointments up to 1 hour before the appointment time.',
      );
    }

    return this.appointmentService.deleteAppointment(id);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete an appointment' })
  @UseGuards(JwtGuard)
  @Delete('doctor/:id')
  async deleteAppointmentForDoctor(@Req() req: any, @Param('id') id: number) {
    const user = req.user;

    const appointment = await this.appointmentService.getAppointmentById(id);

    if (!appointment) {
      throw new NotFoundException('Appointment not found.');
    }

    if (user.role !== 'doctor') {
      throw new UnauthorizedException('Only doctors can use this API.');
    }

    if (appointment.doctorId !== user.id) {
      throw new UnauthorizedException(
        'Doctors can only delete their own appointments.',
      );
    }

    //geçmiş randevularını silememeli.
    const appointmentDate = new Date(appointment.date);
    const now = new Date();
    const nowUTCPlus3 = new Date(now.getTime() + 3 * 60 * 60 * 1000);

    if (appointmentDate < nowUTCPlus3) {
      throw new ForbiddenException('Cannot delete a past appointment.');
    }

    return this.appointmentService.deleteAppointment(id);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete an appointment' })
  @UseGuards(JwtGuard)
  @Delete('admin/:id')
  async deleteAppointmentForAdmin(@Req() req: any, @Param('id') id: number) {
    const user = req.user;

    const appointment = await this.appointmentService.getAppointmentById(id);

    if (!appointment) {
      throw new NotFoundException('Appointment not found.');
    }

    if (user.role !== 'admin') {
      throw new UnauthorizedException(
        'Only admins can delete every appointments.',
      );
    }

    return this.appointmentService.deleteAppointment(id);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get appointments' })
  @UseGuards(JwtGuard)
  @Get()
  async getAllAppointments(@Req() req: any) {
    const user = req.user;

    if (user.role === 'admin') {
      return this.appointmentService.getAllAppointments();
    }

    if (user.role === 'patient') {
      return this.appointmentService.getAppointmentsByPatientId(user.id);
    }

    if (user.role === 'doctor') {
      return this.appointmentService.getAppointmentsByDoctorId(user.id);
    }
    throw new UnauthorizedException(
      'Only admins, patients and doctors can access all appointments.',
    );
  }
}
