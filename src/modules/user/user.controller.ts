import { AuthGuard } from '@/common/guards/auth.guard';
import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';

import { ApiBearerAuth, ApiConsumes, ApiOperation } from '@nestjs/swagger';
import { UserService } from './user.service';
import type { Payload } from '@/util/token.service';
import { User } from '@/common/decorator/user.decorator';
import { UserProfileResponseDto } from './dto/user-response.dto';
import { FileUploadInterceptor } from '@/common/interceptors/file-upload.interceptor';
import {
  CreateAdminDTO,
  UpdateUserProfile,
  UpdateUserRole,
  UserDTO,
  UserIdDTO,
} from './dto/user-request.dto';
import { RoleGuard } from '@/common/guards/role.guard';
import { userRoleEnum } from '@/common/enums/userRole.enum';
import { Roles } from '@/common/decorator/roles.decorator';

@Controller('user')
@UseGuards(AuthGuard)
@ApiBearerAuth()
export class UserController {
  constructor(private readonly userService: UserService) {}

  //me
  @Get('me')
  @ApiOperation({ summary: 'Get User Profile' })
  async getMe(@User() logedUser: Payload) {
    const user = await this.userService.findOne(
      { userId: logedUser.sub },
      { relations: ['file'] },
    );

    if (!user) throw new NotFoundException('User not found');

    return new UserProfileResponseDto(user);
  }

  @Patch('me')
  @UseInterceptors(new FileUploadInterceptor('profilePicture', 1))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Update User Profile' })
  async updateProfile(
    @User() logedUser: Payload,
    @Body() dto: UpdateUserProfile,
    @UploadedFile() profilePicture: Express.Multer.File,
  ) {
    await this.userService.update(
      {
        userId: logedUser.sub,
        email: dto.email,
        fullName: dto.fullName,
        phoneNumber: dto.phoneNumber,
      },
      {
        profilePicture,
        fileType: 'User Profile',
        currentPassword: dto.currentPassword,
        newPassword: dto.newPassword,
      },
    );
    return 'User Updated';
  }

  @Delete('me')
  @ApiOperation({ summary: 'Delete Me' })
  async deleteUser(@User() logedUser: Payload) {
    await this.userService.softDelete({ userId: logedUser.sub });
    return 'User Deleted';
  }

  //admin
  @Get()
  @UseGuards(RoleGuard)
  @Roles(userRoleEnum.ADMIN)
  @ApiOperation({ summary: 'List Users' })
  async find() {
    return await this.userService.find();
  }

  @Get('/:id')
  @UseGuards(RoleGuard)
  @Roles(userRoleEnum.ADMIN)
  @ApiOperation({ summary: 'Find User By Id' })
  async findById(@Param() param: UserIdDTO) {
    return await this.userService.findOne({ userId: param.userId });
  }

  @Get('/search')
  @UseGuards(RoleGuard)
  @Roles(userRoleEnum.ADMIN)
  @ApiOperation({ summary: 'Search User' })
  async searchUser(@Query() queries: UserDTO) {
    return await this.userService.find(queries);
  }

  @Post()
  @UseGuards(RoleGuard)
  @Roles(userRoleEnum.ADMIN)
  @ApiOperation({ summary: 'Create Admin' })
  async createAdmin(@Body() dto: CreateAdminDTO) {
    await this.userService.create(dto);
    return 'User Created';
  }

  @Patch()
  @UseGuards(RoleGuard)
  @Roles(userRoleEnum.ADMIN)
  @ApiOperation({ summary: 'Update User Role' })
  async updateRole(@Body() dto: UpdateUserRole) {
    const user = await this.userService.findOne({ email: dto.email });

    await this.userService.update({ ...user, role: dto.role });
    return 'User Role updated';
  }

  // @Delete('/delete/:userId')
  // @UseGuards(RoleGuard)
  // @Roles(userRoleEnum.ADMIN)
  // @ApiOperation({ summary: 'Delete Admin' })
  // async deleteUser(@Param() params: UserIdDTO) {
  //   await this.userService.softDelete(params);
  //   return 'User Deleted';
  // }

  @Delete('/remove/:userId')
  @UseGuards(RoleGuard)
  @Roles(userRoleEnum.ADMIN)
  @ApiOperation({ summary: 'Remove User' })
  async removeUser(@Param() params: UserIdDTO) {
    await this.userService.hardDelete(params);
    return 'User Removed';
  }
}
