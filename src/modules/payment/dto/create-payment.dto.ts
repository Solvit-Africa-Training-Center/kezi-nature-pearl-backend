import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class MomoPaymentDto {
  @IsString()
  orderId: string;

  @IsString()
  phoneNumber: string;
}
