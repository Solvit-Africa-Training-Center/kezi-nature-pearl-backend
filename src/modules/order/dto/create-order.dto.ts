import { CartItem } from 'src/modules/cart-item/entities/cart-item.entity';

export class CreateOrderDto {
  userId: string;
  items: CartItem[];
}
