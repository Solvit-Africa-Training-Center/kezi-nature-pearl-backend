import { IsEnum, IsOptional } from 'class-validator';
import { PaymentStatus } from '../../../common/enums/product.enum';

export class UpdatePaymentDto {
  @IsEnum(PaymentStatus)
  @IsOptional()
  paymentStatus?: PaymentStatus;
}
