import {
  Controller,
  UseGuards,
  UnauthorizedException,
  NotFoundException,
  //ConflictException,
  Param,
  //Body,
  //Patch,
  Get,
  Req,
} from '@nestjs/common';
import { JwtGuard } from 'src/auth/guards/jwt.guards';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { Admin } from '@prisma/client';

@ApiTags('admin')
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}
  @ApiBearerAuth()
  @ApiOperation({ summary: 'get' })
  @UseGuards(JwtGuard)
  @Get(':id')
  async getAdminByEmail(
    @Param('id') id: number,
    @Req() req: any,
  ): Promise<Admin> {
    if (id !== req.user.id || req.user.role !== 'admin') {
      console.log(req.user.id);
      throw new UnauthorizedException(
        'You are not authorized to access this user',
      );
    }
    const admin = await this.adminService.findAdminById(id);
    if (!admin) {
      throw new NotFoundException('User not found');
    }
    return admin;
  }

  //   @ApiBearerAuth()
  //   @ApiOperation({ summary: 'update' })
  //   @UseGuards(JwtGuard)
  //   @Patch(':id')
  //   async updateUser(
  //     @Param('id') id: number,
  //     @Body() updateUserDto: UpdateUserDto,
  //   ): Promise<Admin> {
  //     try {
  //       const updatedUser = await this.adminService.update(id, updateUserDto);
  //       if (!updatedUser) {
  //         throw new NotFoundException('User not found');
  //       }
  //       return updatedUser;
  //     } catch (error) {
  //       if (error.code === 'P2002' && error.meta && error.meta.target) {
  //         const target = error.meta.target;
  //         throw new ConflictException(`The ${target} is already in use`);
  //       } else {
  //         throw error;
  //       }
  //     }
  //   }
}
