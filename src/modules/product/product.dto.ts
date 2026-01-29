import { productStatusEnum } from 'src/common/enums/productStatus.enum';
import { ApiProperty, PartialType, PickType } from '@nestjs/swagger';
import { IsEnum, IsString, IsUUID } from 'class-validator';

class ProductBaseDTO {
  @ApiProperty()
  @IsUUID()
  productId: string;

  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsEnum(productStatusEnum)
  status: productStatusEnum;

  @ApiProperty()
  @IsString()
  categoryId: string;
}

export class ProductDTO extends PartialType(
  PickType(ProductBaseDTO, [
    'name',
    'description',
    'status',
    'categoryId',
    'productId',
  ]),
) {}

export class CreateProductDTO extends PickType(ProductBaseDTO, [
  'name',
  'description',
  'categoryId',
]) {}

export class UpdateProductDTO extends PartialType(
  PickType(ProductBaseDTO, ['name', 'description', 'categoryId', 'status']),
) {}

export class IdProductDTO extends PickType(ProductBaseDTO, ['productId']) {}
