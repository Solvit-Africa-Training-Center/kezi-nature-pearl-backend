import { Controller, Get, Post, Body, Delete, UseGuards } from '@nestjs/common';
import { CartService } from './cart.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AuthGuard, RolesGuard } from 'src/common/guards';
import { CurrentUser, Roles } from 'src/common/decorator';
import { UserRole } from 'src/common/enums/user.enum';
import { Payload } from 'src/util';
import { RemoveItemFromCartDto } from '../cart-item/dto/request/remove-item-from-cart.dto';
import { CartStatus } from 'src/common/enums/product.enum';

@Controller('cart')
@UseGuards(AuthGuard, RolesGuard)
@ApiBearerAuth()
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post('add-to-cart')
  @Roles(UserRole.CUSTOMER)
  @ApiOperation({ summary: 'Add product to cart' })
  async create(@CurrentUser() user: Payload, @Body() dto: CreateCartDto) {
    return await this.cartService.addToCart(dto, user.sub);
  }

  @Post('check-out')
  @Roles(UserRole.CUSTOMER)
  @ApiOperation({ summary: 'Check out Cart' })
  async checkout(@CurrentUser() user: Payload) {
    await this.cartService.checkout(user.sub);
  }

  @Get()
  @Roles(UserRole.CUSTOMER)
  @ApiOperation({ summary: 'User cart' })
  findOne(@CurrentUser() user: Payload) {
    return this.cartService.findOne({
      where: { userId: user.sub, status: CartStatus.ACTIVE },
      relations: { items: true },
    });
  }

  @Delete()
  @ApiOperation({ summary: 'Delete Item to cart' })
  async removeItems(
    @CurrentUser() user: Payload,
    @Body() dto: RemoveItemFromCartDto,
  ) {
    return await this.cartService.removeItem(dto, user.sub);
  }
}
