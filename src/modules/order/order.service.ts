import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { OrderStatus, PaymentStatus } from 'src/common/enums/product.enum';
import { AdminOrderFilterDto } from './dto/request';
import { CustomerType } from 'src/common/enums/user.enum';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepo: Repository<Order>,
  ) {}

  async create(dto: CreateOrderDto) {
    const totalAmount = dto.items.reduce((sum, item) => {
      return sum + item.totalPrice;
    }, 0);
    let order = this.orderRepo.create({
      ...dto,
      orderStatus: OrderStatus.PENDING,
      paymentStatus: PaymentStatus.PENDING,
      totalAmount,
    });

    await this.orderRepo.save(order);

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

  // Admin

  async findAllForAdmin(filter: AdminOrderFilterDto) {
    const page = filter.page ?? 1;
    const limit = filter.limit ?? 20;

    const qb = this.orderRepo.createQueryBuilder('order');

    if (filter.orderStatus) {
      qb.andWhere('order.orderStatus  = :status', {
        status: filter.orderStatus,
      });
    }

    // if (filter.userId) {
    //   qb.andWhere('order.userId = :userId', { userId: filter.userId });
    // }

    if (filter.customerType === CustomerType.REGISTERED) {
      qb.andWhere('order.userId IS NOT NULL');
    }

    if (filter.customerType === CustomerType.GUEST) {
      qb.andWhere('order.guestId IS NOT NULL');
    }

    if (filter.fromDate) {
      qb.andWhere('order.createdAt >= :fromDate', {
        fromDate: filter.fromDate,
      });
    }

    if (filter.toDate) {
      qb.andWhere('order.createdAt <= :toDate', { toDate: filter.toDate });
    }

    qb.skip((page - 1) * limit)
      .take(filter.limit)
      .orderBy('order.createdAt', 'DESC');

    return qb.getManyAndCount();
  }
}
