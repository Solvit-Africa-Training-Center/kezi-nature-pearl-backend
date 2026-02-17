import { IsUUID, IsNotEmpty, IsNumberString } from 'class-validator';

export class CreateTransactionDto {
  @IsUUID()
  orderId: string;

  
  @IsNumberString()
  amount: string;
}
