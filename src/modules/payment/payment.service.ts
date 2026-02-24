import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment } from './entities/payment.entity';
import { PaymentMethod, PaymentStatus } from 'src/common/enums/product.enum';
import { TransactionService } from '../transaction/transaction.service';
import { MomoPaymentDto } from './dto/create-payment.dto';
import { TransactionStatus } from '../transaction/entities/transaction.entity';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepo: Repository<Payment>,

    private readonly transactionService: TransactionService,
  ) {}

  async momoPaymentService(dto: MomoPaymentDto) {
    let payment = this.paymentRepo.create({
      ...dto,
      orderId: dto.orderId,
      amount: dto.amount,
      paymentGateway: 'PayPack',
      paymentMethod: PaymentMethod.MOMO,
      status: PaymentStatus.PENDING,
    });

    payment = await this.paymentRepo.save(payment);

    await this.transactionService.createTransaction({
      paymentId: payment.id,
      amount: dto.amount,
      phoneNumber: dto.phoneNumber,
    });

    return payment;
  }

  async getPayment(orderId: string) {
    const payments = await this.paymentRepo.find({
      where: { orderId, status: PaymentStatus.PENDING },
    });

    for (const payment of payments) {
      const transactions = await this.transactionService.getTransaction(
        payment.id,
      );

      for (const transaction of transactions) {
        if (transaction.status === TransactionStatus.SUCCESS) {
          await this.paymentRepo.update(payment.id, {
            status: PaymentStatus.PAID,
          });
        } else if (transaction.status === TransactionStatus.FAILED) {
          console.log('failed');

          await this.paymentRepo.update(payment.id, {
            status: PaymentStatus.FAILED,
          });
        }
      }
    }

    return await this.paymentRepo.find({ where: { orderId } });
  }
}
