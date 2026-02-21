import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard, RolesGuard } from 'src/common/guards';
import { CurrentUser, Roles } from 'src/common/decorator';
import { Payload } from 'src/util/token.service';
import { ApiBearerAuth, ApiConsumes, ApiOperation } from '@nestjs/swagger';
import { UserRole } from 'src/common/enums/user.enum';
import { UpdateUserProfile, UpdateUserRolesDto } from './dto/request';
import { FileUploadInterceptor } from 'src/common/interceptors/file-upload.interceptor';

@Controller('user')
@UseGuards(AuthGuard, RolesGuard)
@ApiBearerAuth()
export class UserController {
  constructor(private readonly userService: UserService) {}

  // All

  @Get('profile')
  @ApiOperation({ summary: 'Get user profile' })
  @Roles(UserRole.CUSTOMER, UserRole.ADMIN)
  async getUserProfile(@CurrentUser() user: Payload) {
    return await this.userService.getUserProfile({
      where: { id: user.sub },
      relations: { profile: true },
    });
  }

  @Patch('update')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(new FileUploadInterceptor('picture', 1, false))
  @ApiOperation({ summary: 'Update user profile' })
  @Roles(UserRole.CUSTOMER, UserRole.ADMIN)
  async updateUserProfile(
    @CurrentUser() user: Payload,
    @Body() dto: UpdateUserProfile,
    @UploadedFile() picture: Express.Multer.File,
  ) {
    await this.userService.update(user.sub, dto, picture);
    return await this.userService.getUserProfile({
      where: { id: user.sub },
      relations: { profile: true },
    });
  }

  @Delete('delete')
  @ApiOperation({ summary: 'User Delete Account' })
  @Roles(UserRole.CUSTOMER)
  remove(@CurrentUser() user: Payload) {
    return this.userService.remove(user.sub);
  }

  // Admin

  @Get('all')
  @ApiOperation({ summary: 'Get List of Users' })
  @Roles(UserRole.ADMIN)
  getAllUsers() {
    return this.userService.getAllUsers({ relations: { profile: true } });
  }

  @Patch('update-role')
  @ApiOperation({ summary: 'Update Users Role' })
  @Roles(UserRole.ADMIN)
  async updateUserRole(@Body() users: UpdateUserRolesDto) {
    return await this.userService.updateUserRole(users);
  }
}
