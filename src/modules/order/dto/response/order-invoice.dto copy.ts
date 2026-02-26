import { OrderStatus, PaymentStatus } from 'src/common/enums/product.enum';
import { Order } from '../../entities/order.entity';
import { OrderItemResponseDto } from 'src/modules/item/dto/response/orderItem-response.dto';
import { Expose, Transform } from 'class-transformer';

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

  @Expose({ name: 'finalAmountFormatted' })
  @Transform(({ value }) =>
    value === null || value === undefined ? undefined : value,
  )
  finalAmountFormatted: number;

  items?: object;

  createdAt: Date;

  constructor(order: Order) {
    this.orderNumber = order.orderNumber;
    this.shippingAddressSnapshot = order.shippingAddressSnapshot;
    this.orderStatus = order.status;
    this.finalAmount = order.finalAmount;
    this.items = order.items?.map((item) => {
      return new OrderItemResponseDto(item);
    });
    this.createdAt = order.createdAt;
    this.finalAmountFormatted = order['unitPriceFormatted'];
  }
}
