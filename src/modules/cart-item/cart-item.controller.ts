import {
  Body,
  Controller,
  Delete,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CartItemService } from './cart-item.service';
import { OptionalAuthGuard } from 'src/common/guards';
import { GuestInterceptor } from 'src/common/interceptors/guest.interceptor';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AddItemTocartDto, UpdateCartItemDto } from './dto/request';

@Controller('cart/item')
@UseGuards(OptionalAuthGuard)
@UseInterceptors(GuestInterceptor)
@ApiBearerAuth()
export class CartItemController {
  constructor(private readonly cartItemService: CartItemService) {}

  @Post()
  @ApiOperation({ summary: 'Add product to cart *' })
  async addItem(@Req() req: Request, @Body() dto: AddItemTocartDto) {
    const userId = req['user']?.sub ?? null;
    const guestId = req['guestId'] ?? null;

    return await this.cartItemService.addItemToCart(dto, { userId, guestId });
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update product in cart quantity *' })
  async updateItem(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() dto: UpdateCartItemDto,
  ) {
    const userId = req['user']?.sub ?? null;
    const guestId = req['guestId'] ?? null;

    await this.cartItemService.updateCartItem(id, dto.quantity, {
      userId,
      guestId,
    });
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove item from cart *' })
  async deleteItem(@Req() req: Request, @Param('id') id: string) {
    const userId = req['user']?.sub ?? null;
    const guestId = req['guestId'] ?? null;

    return await this.cartItemService.deleteItem(id, { userId, guestId });
  }
}
