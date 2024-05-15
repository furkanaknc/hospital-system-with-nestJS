import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { compare } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma.service';
import { Admin, Doctor, Patient } from '@prisma/client';
@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  async login(dto: LoginDto) {
    const user = await this.validateUser(dto);
    const payload = {
      email: user.email,
      id: user.id,
      role: user.role,
      sub: {
        name: user.firstName + ' ' + user.lastName,
      },
    };
    return {
      user,
      backendTokens: {
        accessToken: await this.jwtService.signAsync(payload, {
          expiresIn: '1h',
          secret: process.env.jwtSecretKey,
        }),
        refreshTokenKey: await this.jwtService.signAsync(payload, {
          expiresIn: '7d',
          secret: process.env.jwtRefreshTokenKey,
        }),
      },
    };
  }
  async validateUser(dto: LoginDto): Promise<Admin | Doctor | Patient> {
    const admin = await this.prisma.admin.findUnique({
      where: {
        email: dto.email,
      },
    });

    if (admin && (await compare(dto.password, admin.password))) {
      return admin;
    }

    const doctor = await this.prisma.doctor.findUnique({
      where: {
        email: dto.email,
      },
    });

    if (doctor && (await compare(dto.password, doctor.password))) {
      return doctor;
    }

    const patient = await this.prisma.patient.findUnique({
      where: {
        email: dto.email,
      },
    });

    if (patient && (await compare(dto.password, patient.password))) {
      return patient;
    }

    throw new UnauthorizedException('Invalid credentials');
  }
}
