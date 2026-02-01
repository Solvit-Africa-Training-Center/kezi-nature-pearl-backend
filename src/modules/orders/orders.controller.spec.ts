import { Test, TestingModule } from '@nestjs/testing';
import { OrdersService } from './orders.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { Repository } from 'typeorm';
import { OrdersController } from './orders.controller';

describe('OrdersController', () => {
  let controller: OrdersController;
  let service: jest.Mocked<OrdersService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrdersController],
      providers: [
        {
          provide: OrdersService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<OrdersController>(OrdersController);
    service = module.get(OrdersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  
  it('should create an order', async () => {
    const dto = {
      user_id: '123',
      total_amount: 100,
    };

    const result = { order_id: '1', ...dto };

 
    service.create.mockResolvedValue(result as any);

    const response = await controller.create(dto as any);

    expect(service.create).toHaveBeenCalledWith(dto);

    expect(response).toEqual(result);
  });

  it('should return all orders', async () => {
    const result = [{ order_id: '1' }, { order_id: '2' }];

    service.findAll.mockResolvedValue(result as any);

    const response = await controller.findAll();

    expect(service.findAll).toHaveBeenCalled();
    expect(response).toEqual(result);
  });

  it('should return one order by id', async () => {
    const order_id = '1';
    const result = { order_id, total_amount: 100 };

    service.findOne.mockResolvedValue(result as any);

    const response = await controller.findOne(order_id);

    expect(service.findOne).toHaveBeenCalledWith(order_id);
    expect(response).toEqual(result);
  });

  it('should update an order', async () => {
    const order_id = '1';
    const dto = { total_amount: 200 };
    const result = { order_id, ...dto };

    service.update.mockResolvedValue(result as any);

    const response = await controller.update(order_id, dto as any);

    expect(service.update).toHaveBeenCalledWith(order_id, dto);
    expect(response).toEqual(result);
  });

  it('should delete an order', async () => {
    const order_id = '1';
    const result = {
      message: 'Order deleted successfully',
      order_id,
    };

    service.remove.mockResolvedValue(result as any);

    const response = await controller.remove(order_id);

    expect(service.remove).toHaveBeenCalledWith(order_id);
    expect(response).toEqual(result);
  });
});
