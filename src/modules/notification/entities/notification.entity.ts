import { Entity, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import { IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator';
import { BaseEntity } from '../../../common/entities/base.entity';
import { NotificationType } from '../../../common/enums/product.enum';
import { User } from '../../../modules/user/entities/user.entity';

@Entity('notifications')
@Index(['userId', 'isRead', 'createdAt'])
export class Notification extends BaseEntity {
  @Column()
  userId: string;

  @ManyToOne(() => User, (user) => user.notifications, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({
    type: 'enum',
    enum: NotificationType,
  })
  @IsEnum(NotificationType)
  type: NotificationType;

  @Column()
  @IsString()
  title: string;

  @Column('text')
  @IsString()
  message: string;

  @Column('jsonb', { nullable: true })
  @IsOptional()
  data?: Record<string, any>;

  @Column({ name: 'is_read', default: false })
  @IsBoolean()
  isRead: boolean;
}
