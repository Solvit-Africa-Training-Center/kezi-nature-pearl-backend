import { Injectable } from '@nestjs/common';
import { CreateOrderCouponDto } from './dto/create-order-coupon.dto';
import { UpdateOrderCouponDto } from './dto/update-order-coupon.dto';

@Injectable()
export class OrderCouponService {
  create(createOrderCouponDto: CreateOrderCouponDto) {
    return 'This action adds a new orderCoupon';
  }

  findAll() {
    return `This action returns all orderCoupon`;
  }

  findOne(id: number) {
    return `This action returns a #${id} orderCoupon`;
  }

  update(id: number, updateOrderCouponDto: UpdateOrderCouponDto) {
    return `This action updates a #${id} orderCoupon`;
  }

  remove(id: number) {
    return `This action removes a #${id} orderCoupon`;
  }
}
