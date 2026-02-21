import {
  Entity,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  BeforeInsert,
  DeleteDateColumn,
} from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { OrderStatus, PaymentStatus } from '../../../common/enums/product.enum';
import { User } from '../../../modules/user/entities/user.entity';
import { DecimalColumn } from '../../../common/decorator/decimal-column.decorator';
import { OrderItem } from '../../../modules/order-item/entities/order-item.entity';
import { Payment } from '../../../modules/payment/entities/payment.entity';
import { OrderCoupon } from '../../../modules/order-coupon/entities/order-coupon.entity';

@Entity('orders')
export class Order extends BaseEntity {
  @Column({ name: 'order_number', unique: true, nullable: true })
  orderNumber: string;

  @Column({ type: 'uuid', nullable: true })
  userId: string | null = null;

  @ManyToOne(() => User, (user) => user.orders, { nullable: true })
  @JoinColumn({ name: 'userId' })
  user: User | null = null;

  @Column({ type: 'uuid', nullable: true })
  guestId: string | null = null;

  @Column({ name: 'shipping_address', type: 'jsonb', nullable: true })
  shippingAddressSnapshot: {
    fullName: string;
    phoneNumber: string;
    country: string;
    state?: string;
    city?: string;
    province?: string;
    district?: string;
    sector?: string;
    addressLine1?: string;
    postalCode?: string;
  };

  @Column({
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.PENDING,
  })
  orderStatus: OrderStatus;

  @Column({
    type: 'enum',
    enum: PaymentStatus,
    default: PaymentStatus.PENDING,
  })
  paymentStatus: PaymentStatus;

  @DecimalColumn({ name: 'total_amount' })
  totalAmount: number;

  @DecimalColumn({ name: 'shipping_cost', default: 0 })
  shippingCost: number = 0;

  @DecimalColumn({ name: 'discount_amount', default: 0 })
  discountAmount: number = 0;

  @DecimalColumn({ name: 'final_amount' })
  finalAmount: number;

  @Column('text', { nullable: true })
  notes?: string;

  @Column({ name: 'tracking_number', nullable: true })
  trackingNumber?: string;

  @Column({ name: 'estimated_delivery', type: 'date', nullable: true })
  estimatedDelivery?: Date;

  @Column({ name: 'delivered_at', type: 'timestamptz', nullable: true })
  deliveredAt?: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  // Relations
  @OneToMany(() => OrderItem, (orderItem) => orderItem.order, {
    cascade: true,
  })
  items?: OrderItem[];

  @OneToMany(() => Payment, (payment) => payment.order, { cascade: true })
  payments?: Payment[];

  @OneToMany(() => OrderCoupon, (orderCoupon) => orderCoupon.order, {
    cascade: true,
  })
  coupons?: OrderCoupon[];

  @BeforeInsert()
  generateOrderNumber() {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, '0');
    this.orderNumber = `ORD${timestamp}${random}`;

    this.finalAmount =
      this.totalAmount + this.shippingCost - this.discountAmount;
  }

  // Helper methods
  get isPaid(): boolean {
    return this.paymentStatus === PaymentStatus.PAID;
  }

  get isDelivered(): boolean {
    return this.orderStatus === OrderStatus.DELIVERED;
  }

  get isCancelled(): boolean {
    return this.orderStatus === OrderStatus.CANCELLED;
  }

  get isRefunded(): boolean {
    return this.paymentStatus === PaymentStatus.REFUNDED;
  }

  get isProcessing(): boolean {
    return [
      OrderStatus.CONFIRMED,
      OrderStatus.PROCESSING,
      OrderStatus.SHIPPED,
    ].includes(this.orderStatus);
  }
}
