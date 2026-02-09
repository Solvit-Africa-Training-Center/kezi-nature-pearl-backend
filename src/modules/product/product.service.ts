import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/request/create-product.dto';
import { UpdateProductDto } from './dto/request/update-product.dto';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
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
    this.productImageService.create({
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

  update(id: string, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  async remove(id: string) {
    await this.productRepo.delete(id);
    return { message: 'Product delete' };
  }
}
