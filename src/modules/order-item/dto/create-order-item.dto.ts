import { IsInt, IsNumber, Min } from 'class-validator';
import { Product } from 'src/modules/product/entities/product.entity';

export class CreateOrderItemDto {
  orderId: string;

  //   order: Order;

  product: Product;

  productName: string;

  @IsInt()
  @Min(1)
  quantity: number;

  @IsNumber()
  @Min(0)
  unitPrice: number;

  @IsNumber()
  @Min(0)
  totalPrice: number;
}
