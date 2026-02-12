import { OrderStatus } from 'src/common/enums/product.enum';

export class CreateOrderDto {
  shippingAddressId: string;

  billingAddressId: string;

  orderStatus: OrderStatus;

  totalAmount: number;

  shippingCost: number;

  taxAmount: number;

  discountAmount: number;

  finalAmount: number;

  notes?: string;

  trackingNumber?: string;

  estimatedDelivery?: Date;
}
