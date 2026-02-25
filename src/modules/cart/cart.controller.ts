import {
  Controller,
  Get,
  Post,
  Body,
  Delete,
  UseGuards,
  UseInterceptors,
  Req,
  Param,
  Patch,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { OptionalAuthGuard, RolesGuard } from 'src/common/guards';
import { CartResponseDto } from './dto/response/cart-response.dto';
import { GuestInterceptor } from 'src/common/interceptors/guest.interceptor';
import { CartCheckoutDto } from './dto/request';
import { AddItemTocartDto, UpdateCartItemDto } from '../item/dto/request';

@Controller('cart')
@UseGuards(OptionalAuthGuard)
@UseInterceptors(GuestInterceptor)
@ApiBearerAuth()
export class CartController {
  constructor(private readonly cartService: CartService) {}

  // User

  @Get()
  @ApiOperation({ summary: 'Get User cart ' })
  async findOne(@Req() req: Request) {
    const userId = req['user']?.sub ?? null;
    const guestId = req['guestId'] ?? null;

    const cart = await this.cartService.checkCart({ userId, guestId });

    if (!cart) return { message: 'No cart' };

    return new CartResponseDto(cart);
  }

  @Post('item/add')
  @ApiOperation({ summary: 'Add product to cart ' })
  async addItem(@Req() req: Request, @Body() dto: AddItemTocartDto) {
    const userId = req['user']?.sub ?? null;
    const guestId = req['guestId'] ?? null;

    return await this.cartService.addCartItem(dto, { userId, guestId });
  }

  @Patch('item/update/:id')
  @ApiOperation({ summary: 'Update product in cart quantity ' })
  async updateItem(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() dto: UpdateCartItemDto,
  ) {
    const userId = req['user']?.sub ?? null;
    const guestId = req['guestId'] ?? null;

    console.log('Item id ', id);

    return await this.cartService.updateCartItem(id, dto.quantity, {
      userId,
      guestId,
    });
  }

  @Delete('item/remove/:id')
  @ApiOperation({ summary: 'Remove item from cart ' })
  async deleteItem(@Req() req: Request, @Param('id') id: string) {
    const userId = req['user']?.sub ?? null;
    const guestId = req['guestId'] ?? null;

    return await this.cartService.deleteItemFromCart(id, { userId, guestId });
  }

  @Delete('clear')
  @ApiOperation({ summary: 'Clear cart ' })
  async clearCart(@Req() req: Request) {
    const userId = req['user']?.sub ?? null;
    const guestId = req['guestId'] ?? null;

    return await this.cartService.clearCart({ userId, guestId });
  }

  @Post('check-out')
  @ApiOperation({ summary: 'Check out Cart ' })
  async checkout(@Req() req: Request, @Body() dto: CartCheckoutDto) {
    const userId = req['user']?.sub ?? null;
    const guestId = req['guestId'] ?? null;
    return await this.cartService.checkout({ userId, guestId }, dto);
  }
}
