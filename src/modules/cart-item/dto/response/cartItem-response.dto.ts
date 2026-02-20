import { CartItem } from '../../entities/cart-item.entity';

export class CartItemResponseDto {
  id: string;
  product: object;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  constructor(cartItem: CartItem) {
    this.id = cartItem.id;
    this.product = {
      id: cartItem.product.id,
      image: cartItem.product.images ? cartItem.product.images[0].file.url : '',
      name: cartItem.product.name,
      stockquantity: cartItem.product.stockQuantity,
    };
    this.quantity = cartItem.quantity;
    this.unitPrice = cartItem.unitPrice;
    this.totalPrice = cartItem.totalPrice;
  }
}
