import { IsEnum, IsString, IsNotEmpty } from 'class-validator';
import { TransactionStatus } from '../entities/transaction.entity';

export class UpdateTransactionStatusDto {
  @IsEnum(TransactionStatus)
  status: TransactionStatus;
}

export class UpdateTransactionReferenceDto {
  @IsString()
  @IsNotEmpty()
  reference: string;
}
