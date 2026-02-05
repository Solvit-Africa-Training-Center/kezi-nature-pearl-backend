import {
  Entity,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  BeforeInsert,
} from 'typeorm';
import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  IsDate,
} from 'class-validator';
import { BaseEntity } from '../../../common/entities/base.entity';
import { OrderStatus, PaymentStatus } from '../../../common/enums/product.enum';
import { User } from '../../../modules/user/entities/user.entity';
import { Address } from '../../../modules/address/entities/address.entity';
import { DecimalColumn } from '../../../common/decorator/decimal-column.decorator';
import { OrderItem } from '../../../modules/order-item/entities/order-item.entity';
import { Payment } from '../../../modules/payment/entities/payment.entity';
import { OrderCoupon } from '../../../modules/order-coupon/entities/order-coupon.entity';
import { Review } from '../../../modules/review/entities/review.entity';

@Entity('orders')
export class Order extends BaseEntity {
  @Column({ name: 'order_number', unique: true })
  @IsString()
  orderNumber: string;

  @Column()
  userId: string;

  @ManyToOne(() => User, (user) => user.orders)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  shippingAddressId: string;

  @ManyToOne(() => Address)
  @JoinColumn({ name: 'shippingAddressId' })
  shippingAddress: Address;

  @Column()
  billingAddressId: string;

  @ManyToOne(() => Address)
  @JoinColumn({ name: 'billingAddressId' })
  billingAddress: Address;

  @Column({
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.PENDING,
  })
  @IsEnum(OrderStatus)
  orderStatus: OrderStatus;

  @Column({
    type: 'enum',
    enum: PaymentStatus,
    default: PaymentStatus.PENDING,
  })
  @IsEnum(PaymentStatus)
  paymentStatus: PaymentStatus;

  @DecimalColumn({ name: 'total_amount' })
  @IsNumber()
  @Min(0)
  totalAmount: number;

  @DecimalColumn({ name: 'shipping_cost', default: 0 })
  @IsNumber()
  @Min(0)
  shippingCost: number;

  @DecimalColumn({ name: 'tax_amount', default: 0 })
  @IsNumber()
  @Min(0)
  taxAmount: number;

  @DecimalColumn({ name: 'discount_amount', default: 0 })
  @IsNumber()
  @Min(0)
  discountAmount: number;

  @DecimalColumn({ name: 'final_amount' })
  @IsNumber()
  @Min(0)
  finalAmount: number;

  @Column('text', { nullable: true })
  @IsOptional()
  @IsString()
  notes?: string;

  @Column({ name: 'tracking_number', nullable: true })
  @IsOptional()
  @IsString()
  trackingNumber?: string;

  @Column({ name: 'estimated_delivery', type: 'date', nullable: true })
  @IsOptional()
  @IsDate()
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

  @OneToMany(() => Review, (review) => review.order)
  reviews?: Review[];

  @BeforeInsert()
  generateOrderNumber() {
    if (!this.orderNumber) {
      const timestamp = Date.now();
      const random = Math.floor(Math.random() * 1000);
      this.orderNumber = `ORD-${timestamp}-${random}`;
    }
  }

  get isPaid(): boolean {
    return this.paymentStatus === PaymentStatus.PAID;
  }

  get isDelivered(): boolean {
    return this.orderStatus === OrderStatus.DELIVERED;
  }

  get isCancelled(): boolean {
    return this.orderStatus === OrderStatus.CANCELLED;
  }
}
