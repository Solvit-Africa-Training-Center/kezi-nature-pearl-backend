import { PartialType } from '@nestjs/swagger';
import { CreateOrderCouponDto } from './create-order-coupon.dto';

export class UpdateOrderCouponDto extends PartialType(CreateOrderCouponDto) {}
