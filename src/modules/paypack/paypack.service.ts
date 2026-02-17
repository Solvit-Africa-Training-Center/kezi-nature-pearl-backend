import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreatePaypackDto } from './dto/create-paypack.dto';
import { UpdatePaypackDto } from './dto/update-paypack.dto';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class PaypackService {
  private readonly paypackConfig: {
    key: string;
    secret: string;
    url: string;
    currency: string;
  };

  constructor(private readonly config: ConfigService) {
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

  async requestPayment(amount: number, number: string) {
    try {
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
    } catch (error) {
      throw new InternalServerErrorException('problem in axios');
    }
  }

  async create(dto: CreatePaypackDto) {
    await this.requestPayment(dto.amount, dto.phone);
    return { message: 'Request sent' };
  }

  findAll() {
    return `This action returns all paypack`;
  }

  findOne(id: number) {
    return `This action returns a #${id} paypack`;
  }

  update(id: number, updatePaypackDto: UpdatePaypackDto) {
    return `This action updates a #${id} paypack`;
  }

  remove(id: number) {
    return `This action removes a #${id} paypack`;
  }
}
