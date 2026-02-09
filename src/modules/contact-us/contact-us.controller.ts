import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  BadRequestException,
  UseGuards
} from '@nestjs/common';
import { ContactUsService } from './contact-us.service';
import { CreateContactUsDto } from './dto/create-contact-us.dto';
import { RespondContactUsDto } from './dto/create-contact-us.dto';
import { Request } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/common/decorator/user.decorator';


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

  @Post('registered')
  @UseGuards(AuthGuard('jwt'))
  async submitRegisteredMessage(
    @Body() dto: CreateContactUsDto,
    @User('id') userId: string,
  ) {
    if (!dto.name || !dto.email || !dto.subject || !dto.message) {
      throw new BadRequestException(
        'name, email, subject, and message are required',
      );
    }

    return this.contactUsService.createPublicContactMessage({
      ...dto,
      userId,
    });
  }

  @Get('public')
  getAllPublicMessages() {
    return this.contactUsService.getAllPublicMessages();
  }

  @Get('registered')
  getAllMessages() {
    return this.contactUsService.getAllRegisteredMessages();
  }

  @Get(':id')
  getPublicMessageById(@Param('id') id: string) {
    return this.contactUsService.getPublicMessageById({ where: { id } });
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


