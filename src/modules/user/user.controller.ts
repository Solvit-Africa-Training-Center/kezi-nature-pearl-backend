import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import {
  CreateAdminDTO,
  UpdateUserProfile,
  UserDTO,
  UserIdDTO,
} from './user.dto';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { RoleGuard } from 'src/common/guards/role.guard';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { userRoleEnum } from 'src/common/enums/userRole.enum';
import { Roles } from 'src/common/decorator/roles.decorator';

@Controller('user')
@UseGuards(AuthGuard)
@ApiBearerAuth()
@Roles(userRoleEnum.ADMIN)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @UseGuards(RoleGuard)
  @ApiOperation({ summary: 'List Users' })
  async find() {
    return await this.userService.find();
  }

  @Get('/:id')
  @UseGuards(RoleGuard)
  @ApiOperation({ summary: 'Find User By Id' })
  async findById(@Param() param: UserIdDTO) {
    return await this.userService.findOne({ userId: param.userId });
  }

  @Get('/search')
  @UseGuards(RoleGuard)
  @ApiOperation({ summary: 'Search User' })
  async searchUser(@Query() queries: UserDTO) {
    return await this.userService.find(queries);
  }

  @Post()
  @UseGuards(RoleGuard)
  @ApiOperation({ summary: 'Create Admin' })
  async createAdmin(@Body() dto: CreateAdminDTO) {
    await this.userService.create(dto);
    return 'User Created';
  }

  // @Patch()
  // @ApiOperation({ summary: 'Update User Profile' })
  // async updateProfile(@Body() dto: UpdateUserProfile) {
  //   await this.userService.update(dto);
  //   return 'User Created';
  // }

  @Delete('/delete/:userId')
  @ApiOperation({ summary: 'Delete Admin' })
  async deleteUser(@Param() params: UserIdDTO) {
    await this.userService.softDelete(params);
    return 'User Deleted';
  }

  @Delete('/remove/:userId')
  @UseGuards(RoleGuard)
  @ApiOperation({ summary: 'Remove Admin' })
  async removeUser(@Param() params: UserIdDTO) {
    await this.userService.hardDelete(params);
    return 'User Removed';
  }
}
