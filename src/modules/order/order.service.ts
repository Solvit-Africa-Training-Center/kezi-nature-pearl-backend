import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { OrderStatus, PaymentStatus } from 'src/common/enums/product.enum';
import { AdminOrderFilterDto } from './dto/request';
import { ItemService } from '../item/item.service';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepo: Repository<Order>,
    private readonly itemService: ItemService,
  ) {}

  async create(dto: CreateOrderDto) {
    const { items, ...rest } = dto;

    const totalAmount = items.reduce((sum, item) => {
      return sum + item.totalPrice;
    }, 0);

    let order = this.orderRepo.create({
      ...rest,
      orderStatus: OrderStatus.PENDING,
      paymentStatus: PaymentStatus.PENDING,
      totalAmount,
    });

    order = await this.orderRepo.save(order);

    return order;
  }

  async findAll(options?: FindManyOptions<Order>) {
    return await this.orderRepo.find(options);
  }

  async findOne(options: FindOneOptions<Order>) {
    return await this.orderRepo.findOne(options);
  }

  async cancelOrder(id: string) {
    const order = await this.findOne({ where: { id } });

    if (!order) throw new NotFoundException('Order not found');

    if (
      order.orderStatus === OrderStatus.DELIVERED ||
      order.orderStatus === OrderStatus.CANCELLED
    )
      throw new BadRequestException(
        'Order cannot be cancelled because it is already delivered or cancelled.',
      );

    await this.orderRepo.update(order.id, {
      orderStatus: OrderStatus.CANCELLED,
    });

    return { message: 'Order cancelled' };
  }

  update(id: number, updateOrderDto: UpdateOrderDto) {
    return `This action updates a #${id} order`;
  }

  async remove(id: string) {
    const order = await this.findOne({ where: { id } });
    if (!order) throw new NotFoundException('Order not found');

    await this.orderRepo.softDelete(id);
    return { message: 'order deleted' };
  }

  // Admin

  async findAllForAdmin(filter: FindManyOptions<Order>) {
    // const page = filter.page ?? 1;
    // const limit = filter.limit ?? 20;

    // const qb = this.orderRepo.createQueryBuilder('order');

    // if (filter.orderStatus) {
    //   qb.andWhere('order.orderStatus  = :status', {
    //     status: filter.orderStatus,
    //   });
    // }

    // // if (filter.userId) {
    // //   qb.andWhere('order.userId = :userId', { userId: filter.userId });
    // // }

    // if (filter.customerType === CustomerType.REGISTERED) {
    //   qb.andWhere('order.userId IS NOT NULL');
    // }

    // if (filter.customerType === CustomerType.GUEST) {
    //   qb.andWhere('order.guestId IS NOT NULL');
    // }

    // if (filter.fromDate) {
    //   qb.andWhere('order.createdAt >= :fromDate', {
    //     fromDate: filter.fromDate,
    //   });
    // }

    // if (filter.toDate) {
    //   qb.andWhere('order.createdAt <= :toDate', { toDate: filter.toDate });
    // }

    // qb.skip((page - 1) * limit)
    //   .take(filter.limit)
    //   .orderBy('order.createdAt', 'DESC');

    // return qb.getManyAndCount();

    return await this.orderRepo.find({
      ...filter,
      withDeleted: true,
    });
  }
}
