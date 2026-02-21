import { PickType } from '@nestjs/swagger';
import { CartCheckoutDto } from 'src/modules/cart/dto/request';
import { CreateAddressDto } from 'src/modules/address/dto/request';
import { Item } from 'src/modules/item/entities/item.entity';

export class CreateOrderDto extends PickType(CartCheckoutDto, [
  'shippingAddressSnapshot',
]) {
  userId: string;
  guestId: string;
  items: Item[];
  shippingAddressSnapshot: CreateAddressDto;
}
