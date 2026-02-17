import { IsInt, IsNumber, Min } from 'class-validator';
import { Order } from 'src/modules/order/entities/order.entity';
import { Product } from 'src/modules/product/entities/product.entity';

export class CreateOrderItemDto {
  order: Order;

  product: Product;

  quantity: number;

  unitPrice: number;
}
