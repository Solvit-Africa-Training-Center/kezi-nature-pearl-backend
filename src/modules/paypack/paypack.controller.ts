import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PaypackService } from './paypack.service';
import { CreatePaypackDto } from './dto/create-paypack.dto';
import { UpdatePaypackDto } from './dto/update-paypack.dto';

@Controller('paypack')
export class PaypackController {
  constructor(private readonly paypackService: PaypackService) {}

  @Post()
  create(@Body() createPaypackDto: CreatePaypackDto) {
    return this.paypackService.create(createPaypackDto);
  }

  @Get()
  findAll() {
    return this.paypackService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.paypackService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePaypackDto: UpdatePaypackDto) {
    return this.paypackService.update(+id, updatePaypackDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.paypackService.remove(+id);
  }
}
