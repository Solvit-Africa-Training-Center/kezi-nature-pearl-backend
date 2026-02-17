import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { OrderStatus, PaymentStatus } from 'src/common/enums/product.enum';
import { OrderItemService } from '../order-item/order-item.service';
import { ProductService } from '../product/product.service';
import { console } from 'inspector';
import { LoggerService } from 'src/common/logger/logger.service';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepo: Repository<Order>,
    private readonly orderItemService: OrderItemService,
    private readonly productService: ProductService,
    private readonly logger: LoggerService,
  ) {}

  async create(dto: CreateOrderDto) {
    const totalAmount = dto.items.reduce((sum, item) => {
      return sum + item.totalPrice;
    }, 0);
    const order = await this.orderRepo.save({
      ...dto,
      orderStatus: OrderStatus.PENDING,
      paymentStatus: PaymentStatus.PENDING,
      finalAmount: totalAmount,
      totalAmount,
    });

    this.logger.log(`Number of items: ${dto.items.length}`);

    for (const item of dto.items) {
      const product = await this.productService.findOne({
        where: { id: item.productId },
      });

      if (!product) {
        throw new NotFoundException('Product not found');
      }
      await this.orderItemService.create({
        order,
        product,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
      });
    }

    return order;
  }

  async findAll(options?: FindManyOptions<Order>) {
    return await this.orderRepo.find(options);
  }

  async findOne(options: FindOneOptions<Order>) {
    return await this.orderRepo.findOne(options);
  }

  update(id: number, updateOrderDto: UpdateOrderDto) {
    return `This action updates a #${id} order`;
  }

  async remove(id: string) {
    return await this.orderRepo.delete(id);
  }
}
