import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { OrderCouponService } from './order-coupon.service';
import { CreateOrderCouponDto } from './dto/create-order-coupon.dto';
import { UpdateOrderCouponDto } from './dto/update-order-coupon.dto';

@Controller('order-coupon')
export class OrderCouponController {
  constructor(private readonly orderCouponService: OrderCouponService) {}

  @Post()
  create(@Body() createOrderCouponDto: CreateOrderCouponDto) {
    return this.orderCouponService.create(createOrderCouponDto);
  }

  @Get()
  findAll() {
    return this.orderCouponService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.orderCouponService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOrderCouponDto: UpdateOrderCouponDto) {
    return this.orderCouponService.update(+id, updateOrderCouponDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.orderCouponService.remove(+id);
  }
}
