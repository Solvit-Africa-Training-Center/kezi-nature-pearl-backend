import { productStatusEnum } from 'src/common/enums/productStatus.enum';
import { ApiProperty, OmitType, PartialType, PickType } from '@nestjs/swagger';
import {
  IsEnum,
  IsString,
  IsUUID,
  IsOptional,
  IsArray,
  IsNumber,
} from 'class-validator';

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
  @IsUUID()
  categoryId: string;

  @ApiProperty()
  @IsArray()
  @IsString({ each: true })
  images: string[];

  @ApiProperty()
  @IsNumber()
  oldPrice: number;

  @ApiProperty()
  @IsNumber()
  newPrice: number;

  @ApiProperty()
  @IsNumber()
  quantity: number;

  @ApiProperty({ type: [String] })
  @IsArray()
  @IsUUID('all', { each: true })
  ingredientId: string[];
}

export class ProductDTO extends PartialType(
  OmitType(ProductBaseDTO, ['images','ingredientId']),
) {}

export class CreateProductDTO extends PickType(ProductBaseDTO, [
  'name',
  'description',
  'categoryId',
  'images',
  'oldPrice',
  'newPrice',
  'quantity',
  'ingredientId',
]) {}

export class UpdateProductDTO extends PartialType(
  PickType(ProductBaseDTO, [
    'name',
    'description',
    'categoryId',
    'status',
    'images',
    'oldPrice',
    'newPrice',
    'quantity',
    'ingredientId',
  ]),
) {}

export class IdProductDTO extends PickType(ProductBaseDTO, ['productId']) {}
