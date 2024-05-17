import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { Appointment } from '@prisma/client';
import { CreateAppointmentDto } from './dto/createAppointment.dto';

@Injectable()
export class AppointmentService {
  constructor(private readonly prisma: PrismaService) {}

  async createAppointment(
    createAppointmentDto: CreateAppointmentDto,
  ): Promise<Appointment> {
    const { doctorId, patientId, clinicId, date } = createAppointmentDto;

    const clinic = await this.prisma.clinic.findUnique({
      where: { id: clinicId },
    });

    if (!clinic) {
      throw new ConflictException('Specified clinic does not exist.');
    }
    // UTC+3 zaman dilimine çeviriyoruz
    const convertedDate = this.convertToUTCPlus3(new Date(date));

    if (!this.isWeekday(new Date(date))) {
      throw new ConflictException('Appointments can only be made on weekdays.');
    }

    if (
      !(await this.isValidAppointmentCount(patientId, convertedDate, clinicId))
    ) {
      throw new ConflictException(
        'A patient can have a maximum of 3 appointments in different clinics on the same day.',
      );
    }

    if (
      !(await this.isValidAppointmentTime(doctorId, clinicId, convertedDate))
    ) {
      throw new ConflictException(
        'Appointments can only be scheduled between 9-12 and 13-17 in 30-minute intervals, and a doctor cannot work in different clinics on the same day.',
      );
    }

    const existingDoctorAppointment = await this.prisma.appointment.findFirst({
      where: {
        doctorId,
        date: convertedDate,
      },
    });

    if (existingDoctorAppointment) {
      throw new ConflictException(
        'Doctor is not available at the selected time.',
      );
    }

    const existingPatientAppointment = await this.prisma.appointment.findFirst({
      where: {
        patientId,
        date: convertedDate,
      },
    });

    if (existingPatientAppointment) {
      throw new ConflictException(
        'Patient is not available at the selected time.',
      );
    }

    const appointment = await this.prisma.appointment.create({
      data: {
        name: createAppointmentDto.name,
        date: convertedDate,
        doctor: { connect: { id: doctorId } },
        patient: { connect: { id: patientId } },
        clinic: { connect: { id: clinicId } },
      },
    });

    return appointment;
  }

  private async isValidAppointmentCount(
    patientId: number,
    date: string,
    clinicId: number,
  ): Promise<boolean> {
    const startOfDay = new Date(date);
    startOfDay.setUTCHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setUTCHours(23, 59, 59, 999);

    const appointments = await this.prisma.appointment.findMany({
      where: {
        patientId,
        date: {
          gte: startOfDay.toISOString(),
          lte: endOfDay.toISOString(),
        },
      },
    });

    const clinicCount = new Set(
      appointments.map((appointment) => appointment.clinicId),
    );

    return clinicCount.size < 3 && !clinicCount.has(clinicId);
  }

  private async isValidAppointmentTime(
    doctorId: number,
    clinicId: number,
    date: string,
  ): Promise<boolean> {
    const appointmentDate = new Date(date);

    if (isNaN(appointmentDate.getTime())) {
      return false;
    }

    const hour = appointmentDate.getUTCHours();
    const minutes = appointmentDate.getUTCMinutes();

    const isMorningSlot =
      (hour === 9 && (minutes === 0 || minutes === 30)) ||
      (hour > 9 && hour < 12 && (minutes === 0 || minutes === 30));
    const isAfternoonSlot =
      (hour === 13 && minutes === 30) ||
      (hour > 13 && hour < 17 && (minutes === 0 || minutes === 30));

    if (!(isMorningSlot || isAfternoonSlot)) {
      return false;
    }

    const startOfDay = new Date(appointmentDate);
    startOfDay.setUTCHours(0, 0, 0, 0);
    const endOfDay = new Date(appointmentDate);
    endOfDay.setUTCHours(23, 59, 59, 999);

    const existingDoctorAppointments = await this.prisma.appointment.findMany({
      where: {
        doctorId,
        date: {
          gte: startOfDay.toISOString(),
          lte: endOfDay.toISOString(),
        },
      },
      select: {
        clinicId: true,
      },
    });

    const differentClinics = new Set(
      existingDoctorAppointments.map((appointment) => appointment.clinicId),
    );

    if (differentClinics.size > 0 && !differentClinics.has(clinicId)) {
      return false;
    }

    return true;
  }

  //Prisma default olarak utc zaman diliminde gönderiyor. bu zaman karmamşasının önüne geçmek için utc+3 formatına çeviren method
  private convertToUTCPlus3(date: Date): string {
    const utcDate = new Date(date.getTime() + 3 * 60 * 60 * 1000);
    return utcDate.toISOString();
  }
  //Hafta içlerini kontrol etmek için method
  private isWeekday(date: Date): boolean {
    const day = date.getDay();
    return day !== 0 && day !== 6;
  }
}
