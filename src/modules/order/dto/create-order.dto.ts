import { PickType } from '@nestjs/swagger';
import { CartItem } from 'src/modules/cart-item/entities/cart-item.entity';
import { CartCheckoutDto } from 'src/modules/cart/dto/request';

export class CreateOrderDto extends PickType(CartCheckoutDto, [
  'shippingAddressSnapshot',
]) {
  userId: string;
  guestId: string;
  items: CartItem[];
}
