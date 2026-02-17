import { PartialType, PickType } from '@nestjs/swagger';
import { ProductRequestBaseDto } from './base-product.dto';

export class UpdateProductDto extends PartialType(
  PickType(ProductRequestBaseDto, [
    'pictures',
    'name',
    'description',
    'categoryId',
    'price',
    'stockQuantity',
    'lowStockThreshold',
    'weight',
    'ingredients',
  ]),
) {}
