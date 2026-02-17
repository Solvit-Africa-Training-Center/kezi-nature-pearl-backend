import { Injectable } from '@nestjs/common';
import { CreatePaypackDto } from './dto/create-paypack.dto';
import { UpdatePaypackDto } from './dto/update-paypack.dto';

@Injectable()
export class PaypackService {
  create(createPaypackDto: CreatePaypackDto) {
    return 'This action adds a new paypack';
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
