import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  FindManyOptions,
  FindOneOptions,
  Repository,
  FindOptionsOrder,
} from 'typeorm';
import { Notification } from './entities/notification.entity';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { UserService } from '../user/user.service';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepo: Repository<Notification>,

    private readonly userService: UserService,
  ) {}

  async createNotification(
    dto: CreateNotificationDto,
  ): Promise<{ message: string }> {
    for (const id of dto.userIds) {
      const user = await this.userService.findOne({ where: { id } });

      if (!user) continue;

      const notification = this.notificationRepo.create({
        userId: user.id,
        title: dto.title,
        message: dto.message,
        isRead: false,
      });
      await this.notificationRepo.save(notification);
    }

    return { message: 'Notifications created successfully' };
  }

  async findAllForUser(userId: string) {
    const order: FindOptionsOrder<Notification> = { readAt: 'ASC' };

    return this.notificationRepo.find({
      where: { userId },
      order,
    });
  }

  async getNotificationById(
    options: FindOneOptions<Notification>,
  ): Promise<Notification> {
    const notification = await this.notificationRepo.findOne({
      ...options,
    });

    if (!notification) {
      throw new NotFoundException('Notification not found');
    }

    return notification;
  }

  // async getNotificationsByUser(userId: string): Promise<Notification[]> {
  //   return this.notificationRepo.find({
  //     where: { userId },
  //     order: { readAt: 'ASC' },
  //   });
  // }

  async markNotificationAsRead(id: string): Promise<{ message: string }> {
    const notification = await this.notificationRepo.findOne({
      where: { id },
    });

    if (!notification) {
      throw new NotFoundException('Notification not found');
    }

    notification.isRead = true;
    notification.readAt = new Date();

    await this.notificationRepo.save(notification);

    return { message: 'Notification marked as read' };
  }

  async deleteNotification(id: string): Promise<{ message: string }> {
    const notification = await this.notificationRepo.findOne({
      where: { id },
    });

    if (!notification) {
      throw new NotFoundException('Notification not found');
    }

    await this.notificationRepo.softDelete(notification);

    return { message: 'Notification deleted successfully' };
  }
}
