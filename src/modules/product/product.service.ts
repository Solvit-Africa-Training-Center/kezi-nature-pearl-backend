import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Repository,
  FindOptionsWhere,
  FindManyOptions,
  FindOneOptions,
} from 'typeorm';
import { Product } from './product.entity';
import { Ingredient } from '../ingredient/entities/ingredient.entity';
import {
  CreateProductDTO,
  IdProductDTO,
  ProductDTO,
  UpdateProductDTO,
} from './dto/product-request.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
  ) {}

  async find(filters?: FindOneOptions<Product>) {
    return this.productRepo.find({
      ...filters,
    });
  }

  async findOne(filter: FindOneOptions<Product>) {
    const product = await this.productRepo.findOne({
      ...filter,
    });

    if (!product) return null;

    return product;
  }

  async create(productDto: CreateProductDTO) {
    return await this.productRepo.save(productDto);
  }

  async update(idParm: IdProductDTO, product: UpdateProductDTO) {
    const exists = await this.findOne({
      where: { productId: idParm.productId },
    });
    if (!exists) throw new NotFoundException();

    // exists.name = product.name ?? exists.name;
    // exists.description = product.description ?? exists.description;
    // exists.status = product.status ?? exists.status;
    // exists.oldPrice = product.oldPrice ?? exists.oldPrice;
    // exists.newPrice = product.newPrice ?? exists.newPrice;
    // exists.quantity = product.quantity ?? exists.quantity;
    // exists.images = product.images ?? exists.images;
    // exists.images = product.images ?? exists.images;

    // if (product.categoryId) {
    //   exists.categoryId = product.categoryId;
    // }

    // if (product.ingredientsIds) {
    //   exists.ingredients = product.ingredientsIds.map(
    //     (id) => ({ ingredientId: id }) as Ingredient,
    //   );
    // }

    return await this.productRepo.update(idParm, ProductDTO);
  }

  async hardDelete(id: string) {
    await this.productRepo.delete(id);
  }
}
