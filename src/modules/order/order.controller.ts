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
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { AuthGuard, RolesGuard } from 'src/common/guards';
import { CurrentUser, Roles } from 'src/common/decorator';
import { UserRole } from 'src/common/enums/user.enum';
import { Payload } from 'src/util';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('order')
@UseGuards(AuthGuard, RolesGuard)
@ApiBearerAuth()
export class OrderController {
  constructor(private readonly orderService: OrderService) {}
  @Get()
  @Roles(UserRole.CUSTOMER)
  findAll(@CurrentUser() user: Payload) {
    return this.orderService.findAll({ where: { userId: user.sub } });
  }

  @Get(':id')
  @Roles(UserRole.CUSTOMER)
  findOne(@CurrentUser() user: Payload, @Param('id') id: string) {
    return this.orderService.findOne({ where: { id, userId: user.sub } });
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.orderService.update(+id, updateOrderDto);
  }

  @Delete(':id')
  @Roles(UserRole.CUSTOMER)
  remove(@Param('id') id: string) {
    return this.orderService.remove(id);
  }
}
