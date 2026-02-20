import { PickType } from '@nestjs/swagger';
import { AddItemTocartDto } from './create-cart-item.dto';

export class UpdateCartItemDto extends PickType(AddItemTocartDto, [
  'quantity',
]) {}
