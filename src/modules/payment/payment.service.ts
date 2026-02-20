import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment } from './entities/payment.entity';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { Order } from '../order/entities/order.entity';
import { PaymentMethod, PaymentStatus } from 'src/common/enums/product.enum';
import { TransactionService } from '../transaction/transaction.service';
import { MomoPaymentDto } from './dto/create-payment.dto';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepo: Repository<Payment>,

    @InjectRepository(Order)
    private readonly orderRepo: Repository<Order>,
    private readonly transactionService: TransactionService,
  ) {}

  async momoPaymentService(dto: MomoPaymentDto): Promise<Payment> {
    const order = await this.orderRepo.findOne({ where: { id: dto.orderId } });

    if (!order) throw new NotFoundException('Order not found');

    const { transaction, gatewayResponse } =
      await this.transactionService.createTransaction({
        orderId: order.id,
        phoneNumber: dto.phoneNumber,
      });

    const payment = this.paymentRepo.create({
      ...dto,
      order,
      transactionId: transaction.id,
      gatewayResponse,
      amount: order.finalAmount,
      paymentGateway: 'PayPack',
      paymentMethod: PaymentMethod.MOMO,
      paymentStatus: PaymentStatus.PENDING,
    });

    return this.paymentRepo.save(payment);
  }

  // async updatePaymentStatus(
  //   transactionId: string,
  //   status: PaymentStatus,
  // ): Promise<Payment> {
  //   const payment = await this.paymentRepo.findOne({
  //     where: { transactionId },
  //     relations: ['order'],
  //   });

  //   if (!payment) throw new NotFoundException('Payment not found');

  //   payment.paymentStatus = status;
  //   if (status === PaymentStatus.PAID) {
  //     payment.paidAt = new Date();
  //     payment.order.paymentStatus = PaymentStatus.PAID;
  //     await this.orderRepo.save(payment.order);
  //   }

  //   return this.paymentRepo.save(payment);
  // }

  // async getPaymentByTransaction(transactionId: string): Promise<Payment> {
  //   const payment = await this.paymentRepo.findOne({
  //     where: { transactionId },
  //     relations: ['order'],
  //   });

  //   if (!payment) throw new NotFoundException('Payment not found');

  //   return payment;
  // }
}
