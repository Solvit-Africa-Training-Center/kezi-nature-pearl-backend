import {
  Controller,
  Get,
  Post,
  Body,
  Delete,
  UseGuards,
  UseInterceptors,
  Req,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { CreateCartDto } from './dto/request/create-cart.dto';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { OptionalAuthGuard } from 'src/common/guards';
import { UserRole } from 'src/common/enums/user.enum';
import { RemoveItemFromCartDto } from '../cart-item/dto/request/remove-item-from-cart.dto';
import { CartStatus } from 'src/common/enums/product.enum';
import { CartResponseDto } from './dto/response/cart-response.dto';
import { GuestInterceptor } from 'src/common/interceptors/guest.interceptor';

@Controller('cart')
@UseGuards(OptionalAuthGuard)
@UseInterceptors(GuestInterceptor)
@ApiBearerAuth()
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post('add')
  @ApiOperation({ summary: 'Add product to cart' })
  async create(@Req() req: Request, @Body() dto: CreateCartDto) {
    const userId = req['user']?.sub ?? null;
    const guestId = req['guestId'] ?? null;

    return await this.cartService.addToCart(dto, { userId, guestId });
  }

  @Post('check-out')
  @ApiOperation({ summary: 'Check out Cart' })
  async checkout(@Req() req: Request) {
    const userId = req['user']?.sub ?? null;
    const guestId = req['guestId'] ?? null;
    await this.cartService.checkout(userId);
  }

  @Get()
  @ApiOperation({ summary: 'Get User cart' })
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
  @ApiOperation({ summary: 'Delete Item from cart' })
  async removeItems(@Req() req: Request, @Body() dto: RemoveItemFromCartDto) {
    const userId = req['user']?.sub ?? null;
    const guestId = req['guestId'] ?? null;

    return await this.cartService.removeItem(dto, userId, guestId);
  }
}
