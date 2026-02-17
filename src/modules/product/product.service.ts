import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/request/create-product.dto';
import { UpdateProductDto } from './dto/request/update-product.dto';
import {
  DataSource,
  EntityManager,
  FindManyOptions,
  FindOneOptions,
  Repository,
} from 'typeorm';
import { Product } from './entities/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductImageService } from '../product-image/product-image.service';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
    private readonly productImageService: ProductImageService,
  ) {}
  async create(dto: CreateProductDto, pictures: Express.Multer.File[]) {
    const product = await this.productRepo.save(dto);
    await this.productImageService.create({
      files: pictures,
      productId: product.id,
    });
    return { message: 'Product added' };
  }

  async findAll(options?: FindManyOptions<Product>) {
    return await this.productRepo.find(options);
  }

  async findOne(option: FindOneOptions<Product>) {
    return await this.productRepo.findOne(option);
  }

  async update(
    id: string,
    dto: UpdateProductDto,
    pictures?: Express.Multer.File[],
  ) {
    // const repo = option.manager?.getRepository(Product) ?? this.productRepo;

    const product = await this.productRepo.findOne({
      where: { id },
      relations: { images: true },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    if (dto.price && dto.price !== product.price) {
      product.oldPrice = product.price;
    }

    Object.assign(product, dto);

    await this.productRepo.save(product);

    if (pictures?.length) {
      for (const image of product.images ?? []) {
        await this.productImageService.remove(image.id);
      }

      await this.productImageService.create({
        files: pictures,
        productId: product.id,
      });
    }

    return { message: 'Product Updated' };
  }

  async remove(productIds: string[]) {
    for (const id of productIds) {
      const product = await this.findOne({
        where: { id },
        relations: { images: true },
      });

      if (!product) continue;

      if (product.images) {
        for (const image of product.images) {
          this.productImageService.remove(image.id);
        }
      }

      this.productRepo.delete(id);
    }

    return { message: 'Product delete' };
  }
}
