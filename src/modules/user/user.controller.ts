import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard, RolesGuard } from 'src/common/guards';
import { CurrentUser, Roles } from 'src/common/decorator';
import { Payload } from 'src/util/token.service';
import { ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
import { UserRole } from 'src/common/enums/user.enum';
import { UpdateUserDto, UpdateUserProfile } from './dto/request';

@Controller('user')
@UseGuards(AuthGuard, RolesGuard)
@ApiBearerAuth()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('profile')
  @Roles(UserRole.CUSTOMER, UserRole.ADMIN)
  async getUserProfile(@CurrentUser() user: Payload) {
    return await this.userService.getUserProfile({
      where: { id: user.sub },
    });
  }

  @Patch('update')
  @Roles(UserRole.CUSTOMER, UserRole.ADMIN)
  @ApiConsumes('multipart/form-data')
  async updateUserProfile(
    @CurrentUser() user: Payload,
    @Body() dto: UpdateUserProfile,
  ) {
    console.log('Logging Update user :', dto);

    await this.userService.update(user.sub, { ...dto });
    return await this.userService.getUserProfile({
      where: { id: user.sub },
    });
  }

  // @Post()
  // create(@Body() createUserDto: CreateUserDto) {
  //   return this.userService.create(createUserDto);
  // }

  // @Get()
  // findAll() {
  //   return this.userService.findAll();
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
  //   return this.userService.update(+id, updateUserDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.userService.remove(+id);
  // }
}
