import {
  Entity,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  BeforeInsert,
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
  @Column({ name: 'order_number', unique: true })
  orderNumber: string;

  @Column()
  userId: string;

  @ManyToOne(() => User, (user) => user.orders)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ name: 'shipping_address', type: 'jsonb' })
  shippingAddressSnapshot: {
    fullName: string;
    phoneNumber: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    postalCode?: string;
    country: string;
  };

  @Column({ name: 'billing_address', type: 'jsonb', nullable: true })
  billingAddressSnapshot?: {
    fullName: string;
    phoneNumber: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    postalCode?: string;
    country: string;
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
  shippingCost: number;

  @DecimalColumn({ name: 'tax_amount', default: 0 })
  taxAmount: number;

  @DecimalColumn({ name: 'discount_amount', default: 0 })
  discountAmount: number;

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
    if (!this.orderNumber) {
      const timestamp = Date.now();
      const random = Math.floor(Math.random() * 10000)
        .toString()
        .padStart(4, '0');
      this.orderNumber = `ORD${timestamp}${random}`;
    }
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
