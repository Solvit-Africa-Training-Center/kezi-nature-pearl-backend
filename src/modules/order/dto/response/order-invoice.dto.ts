import { OrderStatus, PaymentStatus } from 'src/common/enums/product.enum';
import { Order } from '../../entities/order.entity';
import { OrderItem } from 'src/modules/order-item/entities/order-item.entity';
import { OrderItemResponseDto } from 'src/modules/order-item/dto/response/orderItem-response.dto';

export class OrderInvoiceDto {
  orderNumber: string;

  shippingAddressSnapshot: {
    fullName: string;
    phoneNumber: string;
    country: string;
    state?: string;
    city?: string;
    province?: string;
    district?: string;
    sector?: string;
    addressLine1?: string;
    postalCode?: string;
  };

  orderStatus: OrderStatus;

  paymentStatus: PaymentStatus;

  finalAmount: number;

  items?: object;
  constructor(order: Order) {
    this.orderNumber = order.orderNumber;
    this.shippingAddressSnapshot = order.shippingAddressSnapshot;
    this.orderStatus = order.orderStatus;
    this.paymentStatus = order.paymentStatus;
    this.finalAmount = order.finalAmount;
    this.items = order.items?.map((item) => {
      return new OrderItemResponseDto(item);
    });
  }
}
