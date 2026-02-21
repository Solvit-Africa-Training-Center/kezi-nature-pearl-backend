import { CartItemResponseDto } from 'src/modules/item/dto/response/cartItem-response.dto';
import { Cart } from '../../entities/cart.entity';

export class CartResponseDto {
  id: string;
  items: CartItemResponseDto[] | undefined;
  constructor(cart: Cart) {
    this.id = cart.id;
    this.items = cart.items?.map((item) => {
      return new CartItemResponseDto(item);
    });
  }
}
