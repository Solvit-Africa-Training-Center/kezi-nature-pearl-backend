import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsUUID, IsOptional, IsString } from 'class-validator';

export class CreateTransactionDto {
  @ApiProperty({
    description: 'Transactions made by the user'
  })
  @IsUUID()
  userId: string;

  @IsNumber()
  amount: number;

  @IsOptional()
  @IsString()
  orderId?: string;
}
