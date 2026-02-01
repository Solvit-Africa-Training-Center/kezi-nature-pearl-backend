import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './product.entity';
import {
  CreateProductDTO,
  IdProductDTO,
  UpdateProductDTO,
} from './product.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
  ) {}

  async find(filters?: Partial<Product>) {
    return await this.productRepo.find({ where: filters });
  }

  async create(product: CreateProductDTO) {
    return await this.productRepo.save(product);
  }

  async update(idParm: IdProductDTO, product: UpdateProductDTO) {
    const exists = await this.findOne({ productId: idParm.productId });
    if (!exists) throw new NotFoundException();
    exists.name = product.name ?? exists.name;
    exists.description = product.description ?? exists.description;
    exists.status = product.status ?? exists.status;

    return await this.productRepo.save(exists);
  }

  async findOne(filter: Partial<Product>) {
    return await this.productRepo.findOne({ where: filter });
  }

  async hardDelete(id: string) {
    await this.productRepo.delete(id);
  }
}
