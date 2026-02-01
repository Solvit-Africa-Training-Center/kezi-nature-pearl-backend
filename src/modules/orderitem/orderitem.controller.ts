import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { OrderItemService } from './orderitem.service';
import { CreateOrderItemDto } from './dto/create-orderitem.dto';
import { UpdateOrderitemDto } from './dto/update-orderitem.dto';

@Controller('orderitem')
export class OrderitemController {
  constructor(private readonly orderitemService: OrderItemService) {}

  @Post()
  create(@Body() createOrderitemDto: CreateOrderItemDto) {
    return this.orderitemService.create(createOrderitemDto);
  }

  @Get()
  findAll() {
    return this.orderitemService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.orderitemService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDto: UpdateOrderitemDto) {
    return this.orderitemService.update(id, updateDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.orderitemService.remove(id);
  }
}
