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
    const { name } = dto;
    return this.prisma.clinic.create({
      data: {
        name,
      },
    });
  }
  async updateClinic(id: number, dto: UpdateClinicDto): Promise<Clinic> {
    const { name } = dto;

    const clinic = await this.findClinicById(id);
    if (!clinic) {
      throw new NotFoundException(`Clinic with ID ${id} not found`);
    }

    return this.prisma.clinic.update({
      where: { id },
      data: {
        name,
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
