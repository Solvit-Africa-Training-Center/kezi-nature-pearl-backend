import { Test, TestingModule } from '@nestjs/testing';
import { OrderCouponController } from './order-coupon.controller';
import { OrderCouponService } from './order-coupon.service';

describe('OrderCouponController', () => {
  let controller: OrderCouponController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrderCouponController],
      providers: [OrderCouponService],
    }).compile();

    controller = module.get<OrderCouponController>(OrderCouponController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
