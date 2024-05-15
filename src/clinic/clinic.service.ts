import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { Clinic } from '@prisma/client';
import { CreateClinicDto } from './dto/createClinic.dto';
import { UpdateClinicDto } from './dto/updateClinic.dto';
@Injectable()
export class ClinicService {
  constructor(private readonly prisma: PrismaService) {}
  async getAllClinics() {
    return await this.prisma.clinic.findMany();
  }

  async findClinicById(id: number): Promise<Clinic | null> {
    return this.prisma.clinic.findUnique({ where: { id } });
  }

  async findClinicByName(name: string): Promise<Clinic> {
    return this.prisma.clinic.findUnique({ where: { name } });
  }

  async createClinic(dto: CreateClinicDto): Promise<Clinic> {
    const { name, doctorId, patientId } = dto;

    if (doctorId) {
      const existingDoctor = await this.prisma.doctor.findUnique({
        where: { id: doctorId },
      });
      if (!existingDoctor) {
        throw new NotFoundException(`Doctor with ID ${doctorId} not found`);
      }
    }

    if (patientId) {
      const existingPatient = await this.prisma.patient.findUnique({
        where: { id: patientId },
      });
      if (!existingPatient) {
        throw new NotFoundException(`Patient with ID ${patientId} not found`);
      }
    }

    return this.prisma.clinic.create({
      data: {
        name,
        doctorId: doctorId || undefined,
        patientId: patientId || undefined,
      },
    });
  }
  async updateClinic(id: number, dto: UpdateClinicDto): Promise<Clinic> {
    const { name, doctorId, patientId } = dto;

    const clinic = await this.findClinicById(id);
    if (!clinic) {
      throw new NotFoundException(`Clinic with ID ${id} not found`);
    }

    if (doctorId) {
      const existingDoctor = await this.prisma.doctor.findUnique({
        where: { id: doctorId },
      });
      if (!existingDoctor) {
        throw new NotFoundException(`Doctor with ID ${doctorId} not found`);
      }
    }

    if (patientId) {
      const existingPatient = await this.prisma.patient.findUnique({
        where: { id: patientId },
      });
      if (!existingPatient) {
        throw new NotFoundException(`Patient with ID ${patientId} not found`);
      }
    }

    return this.prisma.clinic.update({
      where: { id },
      data: {
        name,
        doctorId: doctorId || undefined,
        patientId: patientId || undefined,
      },
    });
  }

  async deleteClinic(id: number): Promise<Clinic> {
    const clinic = await this.findClinicById(id);
    if (!clinic) {
      throw new NotFoundException(`Clinic with ID ${id} not found`);
    }

    return this.prisma.clinic.delete({ where: { id } });
  }
}
