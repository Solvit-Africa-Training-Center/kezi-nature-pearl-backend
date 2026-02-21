import { Item } from '../../entities/item.entity';

export class OrderItemResponseDto {
  product: object;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  constructor(orderItem: Item) {
    this.product = {
      image: orderItem.product.images
        ? orderItem.product.images[0].file.url
        : '',
      name: orderItem.product.name,
    };
    this.quantity = orderItem.quantity;
    this.unitPrice = orderItem.unitPrice;
    this.totalPrice = orderItem.totalPrice;
  }
}
