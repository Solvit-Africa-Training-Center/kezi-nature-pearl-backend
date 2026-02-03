import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere } from 'typeorm';
import { Product } from './product.entity';
import { Ingredient } from '../ingredient/entities/ingredient.entity';
import {
  CreateProductDTO,
  IdProductDTO,
  UpdateProductDTO,
} from './dto/product-request.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
  ) {}

  async find(filters?: Partial<Product>) {
    const where: FindOptionsWhere<Product> = {};

    if (filters?.productId) where.productId = filters.productId;
    if (filters?.name) where.name = filters.name;
    if (filters?.status) where.status = filters.status;
    if (filters?.categoryId) where.categoryId = filters.categoryId;

    return this.productRepo.find({
      where,
      relations: ['category', 'ingredients'],
    });
  }

  async findOne(filter: Partial<Product>) {
    const where: FindOptionsWhere<Product> = {};

    if (filter?.productId) where.productId = filter.productId;
    if (filter?.name) where.name = filter.name;
    if (filter?.status) where.status = filter.status;
    if (filter?.categoryId) where.categoryId = filter.categoryId;

    const product = await this.productRepo.findOne({
      where,
      relations: ['category', 'ingredients'],
    });

    if (!product) return null;

    return product;
  }

  async create(productDto: CreateProductDTO) {
    const ingredients = productDto.ingredientsIds?.map((id) => ({
      ingredientId: id,
    }));

    const product = this.productRepo.create({
      ...productDto,
      ingredients,
    });

    return await this.productRepo.save(product);
  }

  async update(
    idParm: IdProductDTO,
    product: UpdateProductDTO & { ingredientsIds?: string[] },
  ) {
    const exists = await this.findOne({ productId: idParm.productId });
    if (!exists) throw new NotFoundException();

    exists.name = product.name ?? exists.name;
    exists.description = product.description ?? exists.description;
    exists.status = product.status ?? exists.status;
    exists.oldPrice = product.oldPrice ?? exists.oldPrice;
    exists.newPrice = product.newPrice ?? exists.newPrice;
    exists.quantity = product.quantity ?? exists.quantity;
    exists.images = product.images ?? exists.images;
    exists.images = product.images ?? exists.images;

    if (product.categoryId) {
      exists.categoryId = product.categoryId;
    }

    if (product.ingredientsIds) {
      exists.ingredients = product.ingredientsIds.map(
        (id) => ({ ingredientId: id }) as Ingredient,
      );
    }

    return await this.productRepo.save(exists);
  }

  async hardDelete(id: string) {
    await this.productRepo.delete(id);
  }
}
