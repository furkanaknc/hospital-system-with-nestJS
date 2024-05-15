import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { Admin } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { CreateAdminDto } from './dto/createAdmin.dto';
import { hash } from 'bcrypt';

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  async findAdminById(id: number): Promise<Admin | null> {
    return this.prisma.admin.findUnique({ where: { id } });
  }

  async findAdminByEmail(email: string): Promise<Admin> {
    return this.prisma.admin.findUnique({ where: { email } });
  }

  async create(dto: CreateAdminDto): Promise<Admin> {
    const admin = await this.prisma.admin.findUnique({
      where: {
        email: dto.email,
      },
    });
    if (admin) throw new ConflictException('email duplicated');

    const hashedPassword = await hash(dto.password, 10);
    const newUser = await this.prisma.admin.create({
      data: {
        ...dto,
        password: hashedPassword,
      },
    });

    console.log('Password:', hashedPassword);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...result } = newUser;
    return { ...result, password: hashedPassword };
  }

  async update(id: number, data: Partial<Admin>): Promise<Admin | null> {
    try {
      if (data.password) {
        data.password = await hash(data.password, 10);
      }

      const updatedUser = await this.prisma.admin.update({
        where: { id },
        data,
      });
      return updatedUser;
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException('User not found');
      } else {
        throw error;
      }
    }
  }

  async delete(id: number): Promise<Admin | null> {
    try {
      const deletedUser = await this.prisma.admin.delete({
        where: { id },
      });
      return deletedUser;
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException('User not found');
      } else {
        throw error;
      }
    }
  }
}
