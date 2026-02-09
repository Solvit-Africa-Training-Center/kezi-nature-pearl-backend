import { Injectable } from '@nestjs/common';
import { CreateProductImageDto } from './dto/create-product-image.dto';
import { UpdateProductImageDto } from './dto/update-product-image.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductImage } from './entities/product-image.entity';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { FileService } from '../file/file.service';
import { FileType } from 'src/common/enums/product.enum';

@Injectable()
export class ProductImageService {
  constructor(
    @InjectRepository(ProductImage)
    private readonly productImageRepo: Repository<ProductImage>,
    private readonly fileService: FileService,
  ) {}
  async create(dto: CreateProductImageDto) {
    for (const file of dto.files) {
      const image = await this.fileService.save(file, FileType.IMAGE);
      return await this.productImageRepo.save({
        productId: dto.productId,
        fileId: image.id,
      });
    }
  }

  async findAll(options?: FindManyOptions<ProductImage>) {
    return await this.productImageRepo.find(options);
  }

  async findOne(option: FindOneOptions<ProductImage>) {
    return await this.productImageRepo.findOne(option);
  }

  update(id: string, updateProductImageDto: UpdateProductImageDto) {
    return `This action updates a #${id} productImage`;
  }

  async remove(id: string) {
    return await this.productImageRepo.delete(id);
  }
}
