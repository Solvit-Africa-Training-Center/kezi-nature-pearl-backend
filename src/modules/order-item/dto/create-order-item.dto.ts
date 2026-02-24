import { IsInt, IsNumber, Min } from 'class-validator';
import { Order } from 'src/modules/order/entities/order.entity';
import { Product } from 'src/modules/product/entities/product.entity';

export class CreateOrderItemDto {
  orderId: string;

  productId: string;

  quantity: number;

  unitPrice: number;
}
