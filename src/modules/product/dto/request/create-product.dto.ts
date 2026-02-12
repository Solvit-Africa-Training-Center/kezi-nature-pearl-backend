import { PickType } from '@nestjs/swagger';
import { ProductRequestBaseDto } from './base-product.dto';

export class CreateProductDto extends PickType(ProductRequestBaseDto, [
  'pictures',
  'name',
  'description',
  'categoryId',
  'price',
  'stockQuantity',
  'ingredients',
]) {}
