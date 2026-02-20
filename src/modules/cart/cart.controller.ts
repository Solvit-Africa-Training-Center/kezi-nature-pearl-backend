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
} from '@nestjs/common';
import { CartService } from './cart.service';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { OptionalAuthGuard } from 'src/common/guards';
import { UserRole } from 'src/common/enums/user.enum';
import { CartStatus } from 'src/common/enums/product.enum';
import { CartResponseDto } from './dto/response/cart-response.dto';
import { GuestInterceptor } from 'src/common/interceptors/guest.interceptor';
import { CartCheckoutDto } from './dto/request';

@Controller('cart')
@UseGuards(OptionalAuthGuard)
@UseInterceptors(GuestInterceptor)
@ApiBearerAuth()
export class CartController {
  constructor(private readonly cartService: CartService) {}

  // User

  @Post('check-out')
  @ApiOperation({ summary: 'Check out Cart *' })
  async checkout(@Req() req: Request, @Body() dto: CartCheckoutDto) {
    const userId = req['user']?.sub ?? null;
    const guestId = req['guestId'] ?? null;
    return await this.cartService.checkout(userId, guestId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get User cart *' })
  async findOne(@Req() req: Request) {
    const userId = req['user']?.sub ?? null;
    const guestId = req['guestId'] ?? null;

    const cart = await this.cartService.findOne({
      where: { userId, guestId, status: CartStatus.ACTIVE },
      relations: { items: { product: { images: { file: true } } } },
    });

    if (!cart) return { message: 'No cart' };

    return new CartResponseDto(cart);
  }

  @Delete()
  @ApiOperation({ summary: 'Clear cart *' })
  async clearCart(@Req() req: Request) {
    const userId = req['user']?.sub ?? null;
    const guestId = req['guestId'] ?? null;

    return await this.cartService.clearCart({ userId, guestId });
  }
}
