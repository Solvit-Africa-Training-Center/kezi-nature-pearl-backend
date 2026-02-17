import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Address } from './entities/address.entity';
import {
  FindManyOptions,
  FindOneOptions,
  FindOptionsWhere,
  Repository,
} from 'typeorm';

@Injectable()
export class AddressService {
  constructor(
    @InjectRepository(Address)
    private readonly addressRepo: Repository<Address>,
  ) {}
  async create(userId: string, dto: CreateAddressDto) {
    const count = await this.addressRepo.count({
      where: { userId },
    });

    await this.addressRepo.update({ userId }, { isDefault: false });

    if (count >= 3) {
      throw new BadRequestException(
        'You can only have a maximum of 3 addresses',
      );
    }

    const address = this.addressRepo.create({
      ...dto,
      userId,
      isDefault: true,
    });

    await this.addressRepo.save(address);

    return { message: 'Address created successfully' };
  }

  async findAll(options?: FindManyOptions<Address>) {
    return await this.addressRepo.find(options);
  }

  async findOne(options: FindOneOptions<Address>) {
    return await this.addressRepo.findOne(options);
  }

  async update(criteria: FindOptionsWhere<Address>, dto: Partial<Address>) {
    await this.addressRepo.update(criteria, dto);
    return { message: 'Address updated' };
  }

  async setDefault(userId: string, id: string) {
    await this.addressRepo.update({ userId }, { isDefault: false });

    await this.addressRepo.update({ id }, { isDefault: true });

    return { message: 'Address set as default' };
  }

  async remove(ids: string[]) {
    for (const id of ids) {
      await this.addressRepo.delete(id);
    }
    return { message: 'Address Deleted' };
  }
}
