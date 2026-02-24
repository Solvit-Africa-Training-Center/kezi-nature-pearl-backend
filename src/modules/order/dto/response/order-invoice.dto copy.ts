import { OrderStatus, PaymentStatus } from 'src/common/enums/product.enum';
import { Order } from '../../entities/order.entity';
import { OrderItemResponseDto } from 'src/modules/item/dto/response/orderItem-response.dto';

export class OrderInvoiceDto {
  orderNumber: string;

  shippingAddressSnapshot: {
    fullName: string;
    phoneNumber: string;
    email: string;
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

  paymentStatus: string[];

  finalAmount: number;

  items?: object;

  createdAt: Date;

  constructor(order: Order) {
    this.orderNumber = order.orderNumber;
    this.shippingAddressSnapshot = order.shippingAddressSnapshot;
    this.orderStatus = order.status;
    // this.paymentStatus = order.payments?.map((payment) => {
    //   return payment.paymentStatus;
    // });
    this.finalAmount = order.finalAmount;
    this.items = order.items?.map((item) => {
      return new OrderItemResponseDto(item);
    });
    this.createdAt = order.createdAt;
  }
}
