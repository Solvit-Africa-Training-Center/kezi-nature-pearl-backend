import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  BadRequestException,
} from '@nestjs/common';
import { ContactUsService } from './contact-us.service';
import { CreateContactUsDto } from './dto/create-contact-us.dto';
import { RespondContactUsDto } from './dto/create-contact-us.dto';

@Controller('public-contact')
export class ContactUsController {
  constructor(private readonly contactUsService: ContactUsService) {}

  @Post()
  async submitMessage(@Body() dto: CreateContactUsDto) {
    if (!dto.name || !dto.email || !dto.subject || !dto.message) {
      throw new BadRequestException(
        'name, email, subject, and message are required',
      );
    }

    return this.contactUsService.createPublicContactMessage(dto);
  }

  @Get('public')
  getAllPublicMessages() {
    return this.contactUsService.getAllPublicMessages();
  }

  @Get(':id')
  getPublicMessageById(@Param('id') id: string) {
    return this.contactUsService.getPublicMessageById({ where: { id } });
  }

  @Get('registered')
  getAllMessages() {
    return this.contactUsService.getAllRegisteredMessages();
  }

  @Patch(':id/respond')
  respondToContact(@Param('id') id: string, @Body() dto: RespondContactUsDto) {
    const adminUserId = 'adminid'; 
    return this.contactUsService.respondToMessage(
      id,
      dto.response,
      adminUserId,                
      
    );
  }
}
