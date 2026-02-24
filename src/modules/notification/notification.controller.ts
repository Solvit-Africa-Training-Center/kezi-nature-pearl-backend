import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { NotificationService } from './notification.service';
import { AuthGuard, RolesGuard } from 'src/common/guards';
import { Roles } from 'src/common/decorator';
import { UserRole } from 'src/common/enums/user.enum';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('notifications')
@UseGuards(AuthGuard, RolesGuard)
@Roles(UserRole.CUSTOMER, UserRole.ADMIN)
@ApiBearerAuth()
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  // @Post()
  // async createForUser(@Body() dto: CreateNotificationDto) {
  //   return await this.notificationService.createNotification(dto);
  // }

  @Get('user/:userId')
  async getAllForUser(@Param('userId') userId: string) {
    return this.notificationService.findAllForUser(userId);
  }

  @Get(':id')
  async getNotificationById(@Param('id') id: string) {
    return this.notificationService.getNotificationById({ where: { id } });
  }

  @Get('mark/:id')
  async markAsReadNotificationById(@Param('id') id: string) {
    return this.notificationService.markNotificationAsRead(id);
  }

  @Delete(':id')
  async deleteNotificationById(@Param('id') id: string) {
    return this.notificationService.deleteNotification(id);
  }
}
