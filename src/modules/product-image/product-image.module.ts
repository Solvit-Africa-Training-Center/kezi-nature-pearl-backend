import { Module } from '@nestjs/common';
import { ProductImageService } from './product-image.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductImage } from './entities/product-image.entity';
import { FileModule } from '../file/file.module';

@Module({
  imports: [TypeOrmModule.forFeature([ProductImage]), FileModule],
  providers: [ProductImageService],
  exports: [ProductImageService],
})
export class ProductImageModule {}
