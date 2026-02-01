import { ordersStatusEnum } from '@/common/enums/orders.enum';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn('uuid')
  order_id: string;

  @Column({ type: 'uuid' })
  user_id: string;

  @Column({
    type: 'enum',
    enum: ordersStatusEnum,
    default: ordersStatusEnum.PLACED,
  })
  order_status: ordersStatusEnum;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  total_amount: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at?: Date;
}
