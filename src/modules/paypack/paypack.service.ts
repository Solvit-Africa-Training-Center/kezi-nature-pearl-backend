import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreatePaypackDto } from './dto/create-paypack.dto';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { InjectRepository } from '@nestjs/typeorm';
import { Payment } from '../payment/entities/payment.entity';
import { Repository } from 'typeorm';
import { Order } from '../order/entities/order.entity';
import { OrderStatus, PaymentStatus } from 'src/common/enums/product.enum';
import { LoggerService } from 'src/common/logger/logger.service';

@Injectable()
export class PaypackService {
  private readonly paypackConfig: {
    key: string;
    secret: string;
    url: string;
    currency: string;
  };

  constructor(
    private readonly config: ConfigService,
    @InjectRepository(Payment)
    private readonly paymentRepo: Repository<Payment>,

    @InjectRepository(Order)
    private readonly orderRepo: Repository<Order>,

    private readonly logger: LoggerService,
  ) {
    const cfg = this.config.get('paypack') as {
      key: string;
      secret: string;
      url: string;
      currency: string;
    };

    if (!cfg || !cfg.key || !cfg.secret || !cfg.url || !cfg.currency) {
      throw new Error('PayPack configuration missing in environment');
    }

    this.paypackConfig = cfg;
  }

  async login(): Promise<string> {
    const response = await axios.post(
      `${this.paypackConfig.url}/auth/agents/authorize`,
      {
        client_id: this.paypackConfig.key,
        client_secret: this.paypackConfig.secret,
      },
    );

    const token = response.data?.access;

    if (!token) {
      throw new Error('Failed to obtain PayPack token');
    }

    return token;
  }

  async requestPayment(amount: number, number: string) {
    const token = await this.login();

    const endpoint = `${this.paypackConfig.url}/transactions/cashin`;

    const response = await axios.post(
      endpoint,
      {
        amount,
        number,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return response.data;
  }

  async handlePaypackWebhook(payload: any) {
    const { reference, status, paidAt } = payload;

    console.log(payload);

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

  // async create(dto: CreatePaypackDto) {
  //   await this.requestPayment(dto.amount, dto.phone);
  //   return { message: 'Request sent' };
  // }

  // findAll() {
  //   return `This action returns all paypack`;
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} paypack`;
  // }

  // update(id: number, updatePaypackDto: UpdatePaypackDto) {
  //   return `This action updates a #${id} paypack`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} paypack`;
  // }
}
