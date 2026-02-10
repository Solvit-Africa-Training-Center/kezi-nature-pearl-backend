import { Type } from 'class-transformer';
import { IsInt, IsUUID } from 'class-validator';

export class CreateCartItemDto {
  @IsUUID()
  cartId: string;

  @IsUUID()
  productId: string;

  @Type(() => Number)
  @IsInt()
  quantity: number;

  @Type(() => Number)
  @IsInt()
  unitPrice: number;
}
