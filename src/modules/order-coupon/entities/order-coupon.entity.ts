import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { IsNumber, Min } from 'class-validator';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Order } from '../../../modules/order/entities/order.entity';
import { Coupon } from '../../../modules/coupon/entities/coupon.entity';
import { DecimalColumn } from '../../../common/decorator/decimal-column.decorator';

@Entity('order_coupon')
export class OrderCoupon extends BaseEntity {
  @Column()
  orderId: string;

  @ManyToOne(() => Order, (order) => order.coupons, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'orderId' })
  order: Order;

  @Column()
  couponId: string;

  @ManyToOne(() => Coupon, (coupon) => coupon.orderCoupons)
  @JoinColumn({ name: 'couponId' })
  coupon: Coupon;

  @DecimalColumn({ name: 'discount_amount' })
  @IsNumber()
  @Min(0)
  discountAmount: number;
}
