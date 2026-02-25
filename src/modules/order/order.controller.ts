import {
  Controller,
  Get,
  Patch,
  Param,
  Delete,
  UseGuards,
  NotFoundException,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { AuthGuard, RolesGuard } from 'src/common/guards';
import { CurrentUser, Roles } from 'src/common/decorator';
import { UserRole } from 'src/common/enums/user.enum';
import { Payload } from 'src/util';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { OrderDetailsDto } from './dto/response/order-details.dto';
import { OrderStatus } from 'src/common/enums/product.enum';

@Controller('order')
@UseGuards(AuthGuard, RolesGuard)
@ApiBearerAuth()
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  // Admin

  @Get('admin')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Get Orders *' })
  async findAllForAdmin() {
    // @Query() query: AdminOrderFilterDto
    const orders = await this.orderService.findAllForAdmin({
      relations: { items: { product: { images: { file: true } } }, user: true },
    });
    return orders.map((order) => new OrderDetailsDto(order));
  }

  @Patch('admin/confirm/:id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Process user order by Id' })
  processOrder(@Param('id') id: string) {
    return this.orderService.updateOrderStatus(id, OrderStatus.PROCESSED);
  }

  @Patch('admin/ship/:id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Ship user order by Id' })
  shippedOrder(@Param('id') id: string) {
    return this.orderService.updateOrderStatus(id, OrderStatus.SHIPPED);
  }

  @Patch('admin/deliver/:id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Deliver user order by Id' })
  deliveredOrder(@Param('id') id: string) {
    return this.orderService.updateOrderStatus(id, OrderStatus.DELIVERED);
  }

  // user
  @Get()
  @Roles(UserRole.CUSTOMER)
  @ApiOperation({ summary: 'Get user orders *' })
  async findAll(@CurrentUser() user: Payload) {
    const orders = await this.orderService.findAll({
      where: { userId: user.sub },
      relations: { items: { product: { images: { file: true } } }, user: true },
      order: { createdAt: 'DESC' },
    });

    return orders.map((order) => new OrderDetailsDto(order));
  }

  @Get(':id')
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

  @Patch('cancel/:id')
  @Roles(UserRole.CUSTOMER)
  @ApiOperation({ summary: 'Cancel user order by Id' })
  cancelOrder(@Param('id') id: string) {
    return this.orderService.updateOrderStatus(id, OrderStatus.CANCELLED);
  }

  @Delete(':id')
  @Roles(UserRole.CUSTOMER)
  remove(@Param('id') id: string) {
    return this.orderService.remove(id);
  }
}
