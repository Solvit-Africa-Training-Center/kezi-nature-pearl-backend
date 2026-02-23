import { ApiPropertyOptional } from '@nestjs/swagger';
import { TransactionStatus } from '../../entities/transaction.entity';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export class TransactionSearchDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  reference: string;

  @ApiPropertyOptional({ enum: TransactionStatus })
  @IsOptional()
  @IsEnum(TransactionStatus)
  status: TransactionStatus;
}
