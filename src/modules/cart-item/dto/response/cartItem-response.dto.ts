import { CartItem } from '../../entities/cart-item.entity';

export class CartItemResponseDto {
  id: string;
  product: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  constructor(cartItem: CartItem) {
    this.id = cartItem.id;
    this.product = cartItem.product.name;
    this.quantity = cartItem.quantity;
    this.unitPrice = cartItem.unitPrice;
    this.totalPrice = cartItem.totalPrice;
  }
}
