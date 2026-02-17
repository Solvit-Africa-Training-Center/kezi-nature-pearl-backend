import { IsUUID, IsNotEmpty, IsNumberString, IsNumber } from 'class-validator';

export class CreateTransactionDto {
  @IsUUID()
  orderId: string;

  @IsNumber()
  phoneNumber: string;
}
