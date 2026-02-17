import { Injectable } from '@nestjs/common';
import { PaymentStatus, OrderStatus } from 'src/common/enums/product.enum';
import { Payment } from './entities/payment.entity';
import { Order } from '../order/entities/order.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class PaypackService {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepo: Repository<Payment>,

    @InjectRepository(Order)
    private readonly orderRepo: Repository<Order>,
  ) {}

  async handlePaypackWebhook(payload: any) {
    const { reference, status, paidAt } = payload;

   
    const payment = await this.paymentRepo.findOne({
      where: { transactionId: reference },
      relations: ['order'],
    });

    if (!payment) return;

    if (status === 'SUCCESS') {

      payment.paymentStatus = PaymentStatus.PAID;
      payment.paidAt = paidAt ? new Date(paidAt) : new Date();
      payment.gatewayResponse = payload;

      if (payment.order) {
        payment.order.paymentStatus = PaymentStatus.PAID;

        payment.order.orderStatus = OrderStatus.CONFIRMED;
      }
    }

    if (status === 'FAILED') {
      payment.paymentStatus = PaymentStatus.FAILED;
      payment.gatewayResponse = payload;

      if (payment.order) {
        payment.order.paymentStatus = PaymentStatus.FAILED;
      }
    }

    await this.paymentRepo.save(payment);

    if (payment.order) {
      await this.orderRepo.save(payment.order);
    }
  }
}
