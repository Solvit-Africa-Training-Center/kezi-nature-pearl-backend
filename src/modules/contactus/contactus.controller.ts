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
import { Contact } from './entities/contactus.entity';

@Controller('contact')
export class ContactusController {
  constructor(private readonly contactusService: ContactusService) {}

  @Get()
  async findAll(): Promise<Contact[]> {
    return await this.contactusService.findAll();
  }

  @Post()
  async create(@Body() dto: CreateContactUsDto): Promise<Contact> {
    return await this.contactusService.create(dto);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Contact> {
    return await this.contactusService.findOne(id);}
  

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateContactusDto) {
    return this.contactusService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.contactusService.remove(+id);
  }
}
