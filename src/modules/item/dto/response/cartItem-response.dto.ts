import { Item } from '../../entities/item.entity';

export class CartItemResponseDto {
  id: string;
  product: object;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  constructor(cartItem: Item) {
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
