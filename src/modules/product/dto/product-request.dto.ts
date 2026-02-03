import { productStatusEnum } from 'src/common/enums/productStatus.enum';
import { ApiProperty, PartialType, PickType } from '@nestjs/swagger';
import { IsEnum, IsString, IsUUID, IsOptional, IsArray, IsNumber } from 'class-validator';

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

  @ApiProperty({ type: [String], required: false })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  images?: string[];

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  imageId?: string;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  oldPrice?: number;

  @ApiProperty()
  @IsNumber()
  newPrice: number;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  quantity?: number;

  @ApiProperty({ type: [String], required: false })
  @IsArray()
  @IsUUID('all', { each: true })
  @IsOptional()
  ingredientsIds?: string[];
}

export class ProductDTO extends PartialType(
  PickType(ProductBaseDTO, [
    'productId',
    'name',
    'description',
    'status',
    'categoryId',
    'images',
    'imageId',
    'oldPrice',
    'newPrice',
    'quantity',
    'ingredientsIds',
  ]),
) {}

export class CreateProductDTO extends PickType(ProductBaseDTO, [
  'name',
  'description',
  'categoryId',
  'images',
  'imageId',
  'oldPrice',
  'newPrice',
  'quantity',
  'ingredientsIds',
]) {}

export class UpdateProductDTO extends PartialType(
  PickType(ProductBaseDTO, [
    'name',
    'description',
    'categoryId',
    'status',
    'images',
    'imageId',
    'oldPrice',
    'newPrice',
    'quantity',
    'ingredientsIds',
  ]),
) {}

export class IdProductDTO extends PickType(ProductBaseDTO, ['productId']) {}
