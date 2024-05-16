import {
  Injectable,
  ConflictException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { Patient } from '@prisma/client';
import { CreatePatientDto } from './dto/createPatient.dto';
import { hash } from 'bcrypt';

@Injectable()
export class PatientService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllPatients() {
    return await this.prisma.patient.findMany();
  }

  async findPatientById(id: number): Promise<Patient | null> {
    return this.prisma.patient.findUnique({ where: { id } });
  }

  async findPatientByEmail(email: string): Promise<Patient> {
    return this.prisma.patient.findUnique({ where: { email } });
  }

  async createPatient(dto: CreatePatientDto): Promise<Patient> {
    const user = await this.prisma.patient.findUnique({
      where: {
        email: dto.email,
      },
    });
    if (user) throw new ConflictException('email duplicated');

    const hashedPassword = await hash(dto.password, 10);
    const newPatient = await this.prisma.patient.create({
      data: {
        ...dto,
        password: hashedPassword,
      },
    });

    //aşağıda yazan yorum  satırı sayesinde 'password' için eslint hatası almamı önledim.
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...result } = newPatient;
    return { ...result, password: hashedPassword };
  }

  async updatePatient(
    id: number,
    data: Partial<Patient>,
    user: any,
  ): Promise<Patient | null> {
    try {
      if (user.id !== id || user.role !== 'patient') {
        throw new UnauthorizedException(
          'Only patients can update their own information',
        );
      }

      if (data.password) {
        data.password = await hash(data.password, 10);
      }

      const updatedPatient = await this.prisma.patient.update({
        where: { id },
        data,
      });

      return updatedPatient;
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException('Patient not found');
      } else {
        throw error;
      }
    }
  }

  async deletePatient(id: number): Promise<Patient | null> {
    try {
      const patient = await this.prisma.patient.delete({
        where: { id },
      });
      return patient;
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException('User not found');
      } else {
        throw error;
      }
    }
  }
}
