import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { TransactionStatus } from '../transaction/entities/transaction.entity';

@Injectable()
export class PaypackService {
  private readonly paypackConfig: {
    key: string;
    secret: string;
    url: string;
    currency: string;
  };

  constructor(private readonly config: ConfigService) {
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

  async findPayment(ref: string, status: TransactionStatus) {
    const token = await this.login();

    const endpoint = `${this.paypackConfig.url}/events/transactions`;

    const response = await axios.get(endpoint, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: { ref },
    });

    const transactions = response.data.transactions || [];

    const transaction = transactions.find(
      (transaction: any) => transaction.data.status !== status,
    );

    return transaction ? transaction.data : null;
  }

  // async handlePaypackWebhook(payload: any) {
  //   const { reference, status, paidAt } = payload;

  //   console.log(payload);

  //   const payment = await this.paymentRepo.findOne({
  //     where: { transactionId: reference },
  //     relations: ['order'],
  //   });

  //   if (!payment) return;

  //   if (status === 'SUCCESS') {
  //     payment.paymentStatus = PaymentStatus.PAID;
  //     payment.paidAt = paidAt ? new Date(paidAt) : new Date();
  //     payment.gatewayResponse = payload;

  //     if (payment.order) {
  //       payment.order.paymentStatus = PaymentStatus.PAID;

  //       payment.order.orderStatus = OrderStatus.CONFIRMED;
  //     }
  //   }

  //   if (status === 'FAILED') {
  //     payment.paymentStatus = PaymentStatus.FAILED;
  //     payment.gatewayResponse = payload;

  //     if (payment.order) {
  //       payment.order.paymentStatus = PaymentStatus.FAILED;
  //     }
  //   }

  //   await this.paymentRepo.save(payment);

  //   if (payment.order) {
  //     await this.orderRepo.save(payment.order);
  //   }
  // }
}
