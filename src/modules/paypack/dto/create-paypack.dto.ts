import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsNumberString, IsString } from 'class-validator';

export class CreatePaypackDto {
  @ApiProperty({ example: '0791164161' })
  @IsString()
  phoneNumber: string;

  @ApiProperty({ example: '1000' })
  @IsNumber()
  amount: number;

  @ApiProperty({ example: '' })
  @IsString()
  idempotency: string;

  @ApiProperty({ example: '' })
  @IsString()
  orderId: string;
}
