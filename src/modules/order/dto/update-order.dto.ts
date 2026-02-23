import { PartialType } from '@nestjs/swagger';
import { CreateOrderDto } from './create-order.dto';
import { OrderStatus } from 'src/common/enums/product.enum';

export class UpdateOrderDto extends PartialType(CreateOrderDto) {
  orderStatus: OrderStatus;
}
