import { Entity, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import { IsEnum, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { BaseEntity } from '../../../common/entities/base.entity';
import {
  PaymentMethod,
  PaymentStatus,
} from '../../../common/enums/product.enum';
import { Order } from '../../../modules/order/entities/order.entity';
import { DecimalColumn } from '../../../common/decorator/decimal-column.decorator';

@Entity('payments')
@Index(['transactionId'], { unique: true })
export class Payment extends BaseEntity {
  @Column()
  orderId: string;

  @ManyToOne(() => Order, (order) => order.payments, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'orderId' })
  order: Order;

  @Column({
    name: 'payment_method',
    type: 'enum',
    enum: PaymentMethod,
  })
  @IsEnum(PaymentMethod)
  paymentMethod: PaymentMethod;

  @Column({
    name: 'payment_status',
    type: 'enum',
    enum: PaymentStatus,
    default: PaymentStatus.PENDING,
  })
  @IsEnum(PaymentStatus)
  paymentStatus: PaymentStatus;

  @DecimalColumn()
  @IsNumber()
  @Min(0)
  amount: number;

  @Column({ name: 'transaction_id', unique: true })
  @IsString()
  transactionId: string;

  @Column({ name: 'payment_gateway' })
  @IsString()
  paymentGateway: string;

  @Column('jsonb', { name: 'gateway_response', nullable: true })
  @IsOptional()
  gatewayResponse?: Record<string, any>;

  @Column({ name: 'paid_at', type: 'timestamptz', nullable: true })
  paidAt?: Date;

  @Column({ name: 'refunded_at', type: 'timestamptz', nullable: true })
  refundedAt?: Date;

  @Column({ unique: true })
  @Index()
  idempotencyKey: string;
}
