import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { ordersStatusEnum } from '../../common/enums/orders.enum';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { Repository } from 'typeorm';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepo: Repository<Order>,
  ) {}

  // Create a new order
  async create(dto: CreateOrderDto): Promise<Order> {
    return await this.orderRepo.save(dto);
  }

  // Get all orders
  async findAll(): Promise<Order[]> {
    return await this.orderRepo.find();
  }

  async findOne(order_id: string): Promise<Order> {
    return this.orderRepo.findOne({ where: { order_id } }).then((order) => {
      if (!order) {
        throw new NotFoundException(`Order with ID ${order_id} not found`);
      }
      return order;
    });
  }

  
  async update(order_id: string, dto: UpdateOrderDto): Promise<Order> {
    const order = await this.orderRepo.findOne({ where: { order_id } });

    if (!order) {
      throw new NotFoundException(`Order with ID ${order_id} not found`);
    }

    const updatedOrder = this.orderRepo.merge(order, dto);
    return this.orderRepo.save(updatedOrder);
  }

  async remove(order_id: string) {
    const result = await this.orderRepo.softDelete(order_id);

    if (result.affected === 0) {
      return { message: 'Order not found or already deleted' };
    }

    return { message: 'Order deleted successfully', order_id };
  };
  
}
