import { Test, TestingModule } from '@nestjs/testing';
import { OrderitemController } from './orderitem.controller';
import { OrderItemService } from './orderitem.service';

describe('OrderitemController', () => {
  let controller: OrderitemController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrderitemController],
      providers: [OrderItemService],
    }).compile();

    controller = module.get<OrderitemController>(OrderitemController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
