import {
  Injectable,
  ConflictException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { Doctor } from '@prisma/client';
import { CreateDoctorDto } from './dto/createDoctor.dto';
import { hash } from 'bcrypt';

@Injectable()
export class DoctorService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllDoctors() {
    return await this.prisma.doctor.findMany();
  }

  async findDoctorById(id: number): Promise<Doctor | null> {
    return this.prisma.doctor.findUnique({ where: { id } });
  }

  async findDoctorByEmail(email: string): Promise<Doctor> {
    return this.prisma.doctor.findUnique({ where: { email } });
  }

  // doctor.controller dosyasında filtreleme yaptığım için burda herhangi 'role' bazlı bir filtreleme yapmadım.
  async createDoctor(dto: CreateDoctorDto): Promise<Doctor> {
    const user = await this.prisma.doctor.findUnique({
      where: {
        email: dto.email,
      },
    });
    if (user) throw new ConflictException('email duplicated');

    const hashedPassword = await hash(dto.password, 10);
    const currentDate = new Date();
    const newDoctor = await this.prisma.doctor.create({
      data: {
        ...dto,
        password: hashedPassword,
        date: currentDate,
      },
    });

    //aşağıda yazan yorum  satırı sayesinde 'password' için eslint hatası almamı önledim.
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...result } = newDoctor;
    return { ...result, password: hashedPassword };
  }

  async updateDoctor(
    id: number,
    data: Partial<Doctor>,
    userRole: string,
  ): Promise<Doctor | null> {
    try {
      if (userRole !== 'doctor') {
        throw new UnauthorizedException(
          'Only doctors can update doctor information',
        );
      }

      if (data.password) {
        data.password = await hash(data.password, 10);
      }

      const updatedDoctor = await this.prisma.doctor.update({
        where: { id },
        data,
      });

      return updatedDoctor;
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException('Doctor not found');
      } else {
        throw error;
      }
    }
  }

  async deleteDoctor(id: number): Promise<Doctor | null> {
    try {
      const doctor = await this.prisma.doctor.delete({
        where: { id },
      });
      return doctor;
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException('User not found');
      } else {
        throw error;
      }
    }
  }
}
