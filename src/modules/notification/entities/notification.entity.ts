import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
  Index,
  DeleteDateColumn,
} from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Order } from '../../order/entities/order.entity';
import { User } from '../../../modules/user/entities/user.entity';

export enum NotificationType {
  ORDER = 'ORDER',
}

@Entity('notifications')
export class Notification extends BaseEntity {
  @Column()
  userId: string;

  @ManyToOne(() => User, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user?: User;

  @Column({ nullable: true })
  orderId?: string;

  @ManyToOne(() => Order, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'orderId' })
  order?: Order;

  @Column()
  title: string;

  @Column('text')
  message: string;

  @Column({
    type: 'enum',
    enum: NotificationType,
    default: NotificationType.ORDER,
  })
  type: string;

  @Column({ default: false })
  isRead: boolean;

  @Index()
  @Column({ type: 'timestamptz', nullable: true })
  readAt?: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
