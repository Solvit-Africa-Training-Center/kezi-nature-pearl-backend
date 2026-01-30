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

@Controller('contact')
export class ContactusController {
  constructor(private readonly contactusService: ContactusService) {}

  @Get()
  findAll() {
    return this.contactusService.findAll();
  }

  @Post()
  create(@Body() dto: CreateContactUsDto) {
    return this.contactusService.create(dto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.contactusService.findOne(id);
  }
}
