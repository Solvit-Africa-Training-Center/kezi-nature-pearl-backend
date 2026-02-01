import { productCategoryEnum } from '@/common/enums/productCategory.enum';
import { ApiProperty, PartialType, PickType } from '@nestjs/swagger';
import { IsEnum, IsString, IsUUID } from 'class-validator';
import { Product } from '../product/product.entity';

class CategoryBaseDTO {
  @ApiProperty()
  @IsUUID()
  categoryId: string;

  @ApiProperty()
  @IsEnum(productCategoryEnum)
  name: productCategoryEnum;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsString()
  product: Product[];
}

export class CategoryDTO extends PartialType(
  PickType(CategoryBaseDTO, ['categoryId', 'name', 'description']),
) {}

export class CreateCategoryDTO extends PickType(CategoryBaseDTO, [
  'name',
  'description',
]) {}

export class UpdateCategoryDTO extends PartialType(CreateCategoryDTO) {}

export class IdCategoryDTO extends PickType(CategoryBaseDTO, ['categoryId']) {}
