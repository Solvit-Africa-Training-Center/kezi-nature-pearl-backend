import { Test, TestingModule } from '@nestjs/testing';
import { OrdersService } from './orders.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { Repository } from 'typeorm';
import { ordersStatusEnum } from '../../common/enums/orders.enum';
import { NotFoundException } from '@nestjs/common';
const savedOrder = {
  order_id: '1',
  user_id: '123',
  total_amount: 100,
  order_status: ordersStatusEnum.PLACED, 
  created_at: new Date(),
  updated_at: new Date(),
} as Order;


describe('OrdersService', () => {
  let service: OrdersService;
  let repo: jest.Mocked<Repository<Order>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrdersService,
        {
          provide: getRepositoryToken(Order),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
            merge: jest.fn(),
            softDelete: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<OrdersService>(OrdersService);
    repo = module.get(getRepositoryToken(Order));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return all orders', async () => {
    const orders = [{ order_id: '1' }] as Order[];

    repo.find.mockResolvedValue(orders);

    const result = await service.findAll();

    expect(result).toEqual(orders);
    expect(repo.find).toHaveBeenCalled();
  });
 it('should create a new order', async () => {
   const dto = {
     user_id: '123',
     total_amount: 100,
     order_status: undefined, 
   };

   const savedOrder = {
     order_id: '1',
     user_id: '123',
     total_amount: 100,
     order_status: 'PLACED',
     created_at: new Date(),
     updated_at: new Date(),
   };


   repo.save.mockResolvedValue(savedOrder as Order);


   const result = await service.create(dto);

   expect(repo.save).toHaveBeenCalledWith(dto);
   expect(result).toEqual(savedOrder);
 });

 it('should return an order it finds', async()=>{
  const order_id = '111'

   const order: Order = {
     order_id,
     user_id: 'user1',
     total_amount: 100,
     order_status: ordersStatusEnum.PLACED,
     created_at: new Date(),
     updated_at: new Date(),
   } as Order; 
   repo.findOne.mockResolvedValue(savedOrder)
const result = await service.findOne(order_id);

expect(repo.findOne).toHaveBeenCalledWith({ where: { order_id } });

expect(result).toEqual(order);
 }
);

 it('should throw NotFoundException if order does not exist', async () => {
   const order_id = 'nonexistent';

   repo.findOne.mockResolvedValue(null);

   await expect(service.findOne(order_id)).rejects.toThrow(NotFoundException);

   expect(repo.findOne).toHaveBeenCalledWith({ where: { order_id } });
 });

 it('should update an existing order', async () => {
   const order_id = '222';
   const dto = {
     total_amount: 200,
     order_status: ordersStatusEnum.SHIPPED,
   };

   // Mock existing order
   const existingOrder: Order = {
     order_id,
     user_id: 'user1',
     total_amount: 100,
     order_status: ordersStatusEnum.PLACED,
     created_at: new Date(),
     updated_at: new Date(),
   } as Order;

   repo.findOne.mockResolvedValue(existingOrder);

   
   const mergedOrder: Order = { ...existingOrder, ...dto } as Order;
   repo.merge.mockReturnValue(mergedOrder);
   repo.save.mockResolvedValue(mergedOrder);

   const result = await service.update(order_id, dto);

   
   expect(repo.findOne).toHaveBeenCalledWith({ where: { order_id } });
   expect(repo.merge).toHaveBeenCalledWith(existingOrder, dto);
   expect(repo.save).toHaveBeenCalledWith(mergedOrder);
   expect(result).toEqual(mergedOrder);
 });

 it('should throw NotFoundExceptions if order not found', async()=>{
  const order_id = 'notexist'
  const dto = {total_amount: 200}

  repo.findOne.mockResolvedValue(null)
  await expect(service.update(order_id, dto)).rejects.toThrow(NotFoundException)
    expect(repo.findOne).toHaveBeenCalledWith({ where: { order_id } });
 })

 it('should delete an existing order successfully', async () => {
   const order_id = '123';

   repo.softDelete.mockResolvedValue({ affected: 1 } as any);

   const result = await service.remove(order_id);

   expect(repo.softDelete).toHaveBeenCalledWith(order_id);

 
   expect(result).toEqual({
     message: 'Order deleted successfully',
     order_id,
   });
 });

 it('should return not found message if order does not exist', async () => {
   const order_id = '456';

   repo.softDelete.mockResolvedValue({ affected: 0 } as any);

   const result = await service.remove(order_id);

   expect(repo.softDelete).toHaveBeenCalledWith(order_id);

   expect(result).toEqual({
     message: 'Order not found or already deleted',
   });
 });
it('should delete an existing order successfully', async () => {
  const order_id = '123';

  repo.softDelete.mockResolvedValue({ affected: 1 } as any);

  const result = await service.remove(order_id);

  expect(repo.softDelete).toHaveBeenCalledWith(order_id);

  expect(result).toEqual({
    message: 'Order deleted successfully',
    order_id,
  });
});

it('should return not found message if order does not exist', async () => {
  const order_id = '456';

  repo.softDelete.mockResolvedValue({ affected: 0 } as any);

  const result = await service.remove(order_id);

  expect(repo.softDelete).toHaveBeenCalledWith(order_id);

  expect(result).toEqual({
    message: 'Order not found or already deleted',
  });
});



});
