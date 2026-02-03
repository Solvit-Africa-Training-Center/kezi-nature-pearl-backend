import { productStatusEnum } from '@/common/enums/productStatus.enum';
import { Product } from '../product.entity';

export class ProductResponseDTO {
  images: string[];

  name: string;

  description: string;

  status: productStatusEnum;

  categoryId: string;

  createdAt: Date;

  constructor(product: Product) {
    this.images = product.images;
    this.name = product.name;
    this.description = product.description;
    this.status = product.status;
    this.categoryId = product.categoryId;
    this.createdAt = product.createdAt;
  }
}
