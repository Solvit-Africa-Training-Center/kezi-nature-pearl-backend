import { Test, TestingModule } from '@nestjs/testing';
import { OrderCouponService } from './order-coupon.service';

describe('OrderCouponService', () => {
  let service: OrderCouponService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OrderCouponService],
    }).compile();

    service = module.get<OrderCouponService>(OrderCouponService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
