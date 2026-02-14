import {
  Controller,
  Get,
  Post,
  Body,
  Delete,
  UseGuards,
  UseFilters,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { CreateCartDto } from './dto/request/create-cart.dto';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AuthGuard, RolesGuard } from 'src/common/guards';
import { CurrentUser, Roles } from 'src/common/decorator';
import { UserRole } from 'src/common/enums/user.enum';
import { Payload } from 'src/util';
import { RemoveItemFromCartDto } from '../cart-item/dto/request/remove-item-from-cart.dto';
import { CartStatus } from 'src/common/enums/product.enum';
import { CartResponseDto } from './dto/response/cart-response.dto';
import { AllExceptionsFilter } from 'src/common/filters/AllExceptionFilter';

@Controller('cart')
@UseGuards(AuthGuard, RolesGuard)
@Roles(UserRole.CUSTOMER)
@ApiBearerAuth()
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post('add-to-cart')
  @ApiOperation({ summary: 'Add product to cart' })
  async create(@CurrentUser() user: Payload, @Body() dto: CreateCartDto) {
    return await this.cartService.addToCart(dto, user.sub);
  }

  @Post('check-out')
  @ApiOperation({ summary: 'Check out Cart' })
  async checkout(@CurrentUser() user: Payload) {
    await this.cartService.checkout(user.sub);
  }

  @Get()
  @ApiOperation({ summary: 'User cart' })
  async findOne(@CurrentUser() user: Payload) {
    const cart = await this.cartService.findOne({
      where: { userId: user.sub, status: CartStatus.ACTIVE },
      relations: { items: { product: { images: { file: true } } } },
    });

    if (!cart) return { message: 'No cart' };

    return new CartResponseDto(cart);
  }

  @Delete()
  @ApiOperation({ summary: 'Delete Item from cart' })
  async removeItems(
    @CurrentUser() user: Payload,
    @Body() dto: RemoveItemFromCartDto,
  ) {
    return await this.cartService.removeItem(dto, user.sub);
  }
}
