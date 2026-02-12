import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { ProductStatus } from 'src/common/enums/product.enum';
import { CreateFilesDto } from 'src/modules/file/dto/request';

export class ProductRequestBaseDto extends CreateFilesDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  categoryId: string;

  @ApiProperty()
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  price: number;

  @ApiProperty()
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  salePrice: number;

  @ApiProperty()
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  costPrice: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  stockQuantity: number;

  @ApiProperty()
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  lowStockThreshold: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  weight: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  ingredients: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(ProductStatus)
  status: ProductStatus;
}
