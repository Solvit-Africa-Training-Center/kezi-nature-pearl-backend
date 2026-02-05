import { Module } from '@nestjs/common';
import { OrderCouponService } from './order-coupon.service';
import { OrderCouponController } from './order-coupon.controller';

@Module({
  controllers: [OrderCouponController],
  providers: [OrderCouponService],
})
export class OrderCouponModule {}
