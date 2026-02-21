import { OrderStatus, PaymentStatus } from 'src/common/enums/product.enum';
import { Order } from '../../entities/order.entity';
import { OrderItem } from 'src/modules/order-item/entities/order-item.entity';
import { OrderItemResponseDto } from 'src/modules/order-item/dto/response/orderItem-response.dto';
import { OrderInvoiceDto } from './order-invoice.dto copy';

export class OrderDetailsDto extends OrderInvoiceDto {
  id: string;
  constructor(order: Order) {
    super(order);
    this.id = order.id;
  }
}
