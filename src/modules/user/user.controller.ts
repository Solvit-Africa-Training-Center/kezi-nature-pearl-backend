import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateAdminDTO, UserDTO, UserIdDTO } from './user.dto';
import { ApiOperation } from '@nestjs/swagger';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @ApiOperation({ summary: 'List Users' })
  async listUsers() {
    return await this.userService.find();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Search User' })
  async searchUser(@Query() queries: UserDTO) {
    return await this.userService.find(queries);
  }

  @Post()
  @ApiOperation({ summary: 'Create Admin' })
  async createAdmin(@Body() dto: CreateAdminDTO) {
    await this.userService.create(dto);
    return 'User Created';
  }

  @Delete('/delete/:userId')
  @ApiOperation({ summary: 'Delete Admin' })
  async deleteUser(@Param() params: UserIdDTO) {
    await this.userService.softDelete(params);
    return 'User Deleted';
  }

  @Delete('/remove/:userId')
  @ApiOperation({ summary: 'Remove Admin' })
  async removeUser(@Param() params: UserIdDTO) {
    await this.userService.hardDelete(params);
    return 'User Removed';
  }
}
