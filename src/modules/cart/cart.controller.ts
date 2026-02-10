import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AuthGuard, RolesGuard } from 'src/common/guards';
import { Roles, User } from 'src/common/decorator';
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
  async create(@User() user: Payload, @Body() dto: CreateCartDto) {
    return await this.cartService.create(dto, user.sub);
  }

  @Get()
  @Roles(UserRole.CUSTOMER)
  @ApiOperation({ summary: 'User cart' })
  findOne(@User() user) {
    return this.cartService.findOne({
      where: { userId: user.sub, status: CartStatus.ACTIVE },
      relations: { items: true },
    });
  }

  @Delete()
  @ApiOperation({ summary: 'Delete Item to cart' })
  async removeItem(@User() user: Payload, @Body() dto: RemoveItemFromCartDto) {
    return await this.cartService.removeItem(dto, user.sub);
  }
}
