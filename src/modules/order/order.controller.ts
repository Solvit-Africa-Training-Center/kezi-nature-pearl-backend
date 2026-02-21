import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  NotFoundException,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { AuthGuard, RolesGuard } from 'src/common/guards';
import { CurrentUser, Roles } from 'src/common/decorator';
import { UserRole } from 'src/common/enums/user.enum';
import { Payload } from 'src/util';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AdminOrderFilterDto } from './dto/request';
import { OrderDetailsDto } from './dto/response/order-details.dto';

@Controller('order')
@UseGuards(AuthGuard, RolesGuard)
@ApiBearerAuth()
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  // user
  @Get()
  @Roles(UserRole.CUSTOMER)
  @ApiOperation({ summary: 'Get user orders *' })
  async findAll(@CurrentUser() user: Payload) {
    const orders = await this.orderService.findAll({
      where: { userId: user.sub },
      relations: { items: { product: { images: { file: true } } } },
    });

    return orders.map((order) => new OrderDetailsDto(order));
  }

  @Get('id')
  @Roles(UserRole.CUSTOMER)
  @ApiOperation({ summary: 'Get user order by Id *' })
  async findOne(@CurrentUser() user: Payload, @Param('id') id: string) {
    const order = await this.orderService.findOne({
      where: { id, userId: user.sub },
      relations: { items: true },
    });

    if (!order) throw new NotFoundException('Order not found');

    return new OrderDetailsDto(order);
  }

  @Patch('cancel/id')
  @Roles(UserRole.CUSTOMER)
  @ApiOperation({ summary: 'Cancel user order by Id' })
  cancelOrder(@Param('id') id: string) {
    return this.orderService.cancelOrder(id);
  }

  @Delete(':id')
  @Roles(UserRole.CUSTOMER)
  remove(@Param('id') id: string) {
    return this.orderService.remove(id);
  }

  // Admin

  @Get('admin')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Get Orders *' })
  async findAllForAdmin() {
    // @Query() query: AdminOrderFilterDto
    const orders = await this.orderService.findAllForAdmin({
      relations: { items: { product: { images: { file: true } } } },
    });
    return orders.map((order) => new OrderDetailsDto(order));
  }
}
