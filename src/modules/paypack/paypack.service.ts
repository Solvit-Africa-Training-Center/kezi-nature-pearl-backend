import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreatePaypackDto } from './dto/create-paypack.dto';
import { UpdatePaypackDto } from './dto/update-paypack.dto';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { InjectRepository } from '@nestjs/typeorm';
import { Payment } from '../payment/entities/payment.entity';
import { Repository } from 'typeorm';
import { Order } from '../order/entities/order.entity';
import { OrderStatus, PaymentStatus } from 'src/common/enums/product.enum';
import { PaymentMethod } from 'src/common/enums/product.enum';

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
  ) {
    const cfg = config.get('paypack') as {
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

  async requestPayment(dto: CreatePaypackDto) {
    const existing = await this.paymentRepo.findOne({
      where: { idempotencyKey: dto.idempotency },
    });
    if (existing) return existing;

    try {
      const token = await this.login();

      const endpoint = `${this.paypackConfig.url}/transactions/cashin`;

      const response = await axios.post(
        endpoint,
        {
          amount: dto.amount,
          number: dto.phoneNumber,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      const payment = this.paymentRepo.create({
        amount: dto.amount,
        paymentMethod: PaymentMethod.MOMO,
        paymentGateway: 'Paypack',
        transactionId: response.data?.ref,
        idempotencyKey: dto.idempotency,
        gatewayResponse: response.data,
        paymentStatus: PaymentStatus.PENDING,
        orderId: dto.orderId,
      });

      await this.paymentRepo.save(payment);

      return payment;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Problem calling Paypack API');
    }
  }

  async requestCashout(dto: CreatePaypackDto) {
    const existing = await this.paymentRepo.findOne({
      where: { idempotencyKey: dto.idempotency },
    });
    if (existing) return existing;

    try {
      const token = await this.login();
      const endpoint = `${this.paypackConfig.url}/transactions/cashout`;

      const response = await axios.post(
        endpoint,
        {
          amount: dto.amount,
          number: dto.phoneNumber,
        },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      const payment = this.paymentRepo.create({
        amount: dto.amount,
        paymentMethod: PaymentMethod.MOMO,
        paymentGateway: 'Paypack',
        transactionId: response.data?.ref,
        idempotencyKey: dto.idempotency,
        gatewayResponse: response.data,
        paymentStatus: PaymentStatus.PENDING,
       
      });

      await this.paymentRepo.save(payment);
      return payment;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(
        'Problem calling Paypack Cashout API',
      );
    }
  }

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
  async create(dto: CreatePaypackDto) {
    const idempotencyKey = `paypack-${Date.now()}-${Math.random()}`;
    const payment = await this.requestPayment(dto);
    return { message: 'Request sent', payment };
  }

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
