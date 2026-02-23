import { IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class MomoPaymentDto {
  @IsString()
  orderId: string;

  @IsNumber()
  amount: number;

  @IsString()
  phoneNumber: string;
}
