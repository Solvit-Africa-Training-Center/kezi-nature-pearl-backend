import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { CreateFilesDto } from 'src/modules/file/dto/request';

export class ProductRequestBaseDto extends CreateFilesDto {
  @ApiProperty({ example: 'Soap' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: 'Soap product' })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  categoryId: string;

  @ApiProperty({ example: '1000' })
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  price: number;

  @ApiProperty({ example: '100' })
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  stockQuantity: number;

  @ApiProperty({ example: '10' })
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  lowStockThreshold: number;

  @ApiProperty({ example: '50kg' })
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  weight: number;

  @ApiProperty({ example: 'Salt' })
  @IsNotEmpty()
  @IsString()
  ingredients: string;
}
