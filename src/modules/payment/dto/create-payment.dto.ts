import { IsEnum, IsNumber, IsString, Min } from 'class-validator';
import {
  PaymentMethod,
  PaymentStatus,
} from '../../../common/enums/product.enum';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePaymentDto {
  @ApiProperty({ example: '' })
  @IsString()
  orderId: string;

  @ApiProperty({ example: '' })
  @IsString()
  phoneNumber: string;
}
