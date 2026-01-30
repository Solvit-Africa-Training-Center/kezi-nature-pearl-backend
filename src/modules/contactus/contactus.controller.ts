import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import { ContactusService } from './contactus.service';
import { CreateContactUsDto } from './dto/create-contactus.dto';
import { UpdateContactusDto } from './dto/update-contactus.dto';

@Controller('contact') // <-- make sure this decorator is here
export class ContactusController {
  constructor(private readonly contactusService: ContactusService) {}

  @Post()
  create(@Body() dto: CreateContactUsDto) {
    return this.contactusService.create(dto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.contactusService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateContactusDto) {
    return this.contactusService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.contactusService.remove(+id);
  }
}
