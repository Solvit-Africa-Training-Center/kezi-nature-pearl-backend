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
import { PaymentService } from '../payment/payment.service';
import { LoggerService } from 'src/common/logger/logger.service';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepo: Repository<Order>,
    private readonly paymentRepo: PaymentService,
    private readonly logger: LoggerService,
  ) {}

  async create(dto: CreateOrderDto) {
    const { items, ...rest } = dto;

    const totalAmount = items.reduce((sum, item) => {
      return sum + item.totalPrice;
    }, 0);

    let order = this.orderRepo.create({
      ...rest,
      status: OrderStatus.PENDING,
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

  async update(paymentId: string, dto: UpdateOrderDto) {
    const order = await this.findOne({
      where: { payments: { id: paymentId } },
    });
    if (!order) throw new NotFoundException('Order not found');

    return await this.orderRepo.update(order.id, dto);
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

  async updateOrderStatus(id: string, status: OrderStatus) {
    const order = await this.findOne({ where: { id } });

    if (!order) throw new NotFoundException('Order not found');

    if (status === OrderStatus.CANCELLED) {
      if (
        order.status === OrderStatus.DELIVERED ||
        order.status === OrderStatus.CANCELLED
      )
        throw new BadRequestException(
          'Order cannot be cancelled because it is already delivered or cancelled.',
        );

      await this.orderRepo.update(order.id, {
        status: OrderStatus.DELIVERED,
      });
    } else if (status === OrderStatus.PROCESSED) {
      if (order.status !== OrderStatus.CONFIRMED)
        throw new BadRequestException(
          `Order cannot be processed because it's status is not confirmed`,
        );

      await this.orderRepo.update(order.id, {
        status: OrderStatus.PROCESSED,
      });
    } else if (status === OrderStatus.SHIPPED) {
      if (order.status !== OrderStatus.PROCESSED)
        throw new BadRequestException(
          `Order cannot be shipped because it's status is not processed`,
        );

      await this.orderRepo.update(order.id, {
        status: OrderStatus.SHIPPED,
      });
    } else if (status === OrderStatus.DELIVERED) {
      if (order.status !== OrderStatus.SHIPPED)
        throw new BadRequestException(
          'Order cannot be delivered because it is not shipped.',
        );

      await this.orderRepo.update(order.id, {
        status: OrderStatus.DELIVERED,
      });
    }

    return { message: `Order ${status}` };
  }

  //
  async checkOrders() {
    const orders = await this.findAll({
      where: { status: OrderStatus.PENDING },
      relations: { payments: true },
    });

    for (const order of orders) {
      const payments = await this.paymentRepo.getPayment(order.id);

      for (const payment of payments) {
        if (payment.status === PaymentStatus.PAID)
          await this.orderRepo.update(order.id, {
            status: OrderStatus.CONFIRMED,
          });

        if (payment.status === PaymentStatus.FAILED)
          await this.orderRepo.update(order.id, {
            status: OrderStatus.CANCELLED,
          });
      }
    }
    return await this.findAll({
      relations: { payments: true },
    });
  }
}
