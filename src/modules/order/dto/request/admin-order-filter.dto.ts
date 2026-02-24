import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsInt,
  IsOptional,
  IsUUID,
} from 'class-validator';
import { OrderStatus } from 'src/common/enums/product.enum';
import { CustomerType } from 'src/common/enums/user.enum';

export class AdminOrderFilterDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsEnum(OrderStatus)
  orderStatus?: OrderStatus;

  // @ApiPropertyOptional()
  // @IsOptional()
  // @IsUUID()
  // userId?: string;

  @ApiPropertyOptional({ enum: CustomerType })
  @IsOptional()
  @IsEnum(CustomerType)
  customerType?: CustomerType;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  fromDate?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  toDate?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  page?: number = 1;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  limit?: number = 20;
}
