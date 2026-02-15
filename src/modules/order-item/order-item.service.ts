import { Injectable } from '@nestjs/common';
import { CreateOrderItemDto } from './dto/create-order-item.dto';
import { UpdateOrderItemDto } from './dto/update-order-item.dto';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { OrderItem } from './entities/order-item.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class OrderItemService {
  constructor(
    @InjectRepository(OrderItem)
    private readonly orderItemRepo: Repository<OrderItem>,
  ) {}
  async create(dto: CreateOrderItemDto) {
    return await this.orderItemRepo.save(dto);
  }

  async findAll(options?: FindManyOptions<OrderItem>) {
    return await this.orderItemRepo.find(options);
  }

  async findOne(options: FindOneOptions<OrderItem>) {
    return await this.orderItemRepo.findOne(options);
  }

  update(id: number, updateOrderItemDto: UpdateOrderItemDto) {
    return `This action updates a #${id} orderItem`;
  }

  async remove(ids: string[]) {
    for (const id of ids) {
      const orderItem = await this.findOne({ where: { id } });
      if (!orderItem) continue;
      await this.orderItemRepo.delete(id);
    }
  }
}
