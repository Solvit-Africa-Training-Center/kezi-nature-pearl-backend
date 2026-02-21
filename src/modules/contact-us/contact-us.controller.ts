import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  BadRequestException,
  UseGuards,
} from '@nestjs/common';
import { ContactUsService } from './contact-us.service';
import { CreateContactUsDto } from './dto/create-publiccontact-us.dto';
import { RespondContactUsDto } from './dto/create-publiccontact-us.dto';
import { AuthGuard, RolesGuard } from 'src/common/guards';
import { CurrentUser, Roles } from 'src/common/decorator';
import { UserRole } from 'src/common/enums/user.enum';
import { ApiBearerAuth } from '@nestjs/swagger';
import { CreateRegisteredContactUsDto } from './dto/create-registeredcontact-us.dto';
import { Payload } from 'src/util';

@Controller('public-contact')
export class ContactUsController {
  constructor(private readonly contactUsService: ContactUsService) {}

  @Post()
  submitMessage(@Body() dto: CreateContactUsDto) {
    return this.contactUsService.createPublicContactMessage(dto);
  }

  @Post('registered')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.CUSTOMER)
  @ApiBearerAuth()
  async submitRegisteredMessage(
    @CurrentUser() user: Payload,
    @Body() dto: CreateRegisteredContactUsDto,
  ) {
    return this.contactUsService.createRegisteredContactMessage(dto, user.sub);
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

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @Patch(':id/respond')
  respondToContact(
    @CurrentUser() user: Payload,
    @Param('id') id: string,
    @Body() dto: RespondContactUsDto,
  ) {
    return this.contactUsService.respondToMessage(id, dto.response, user.sub);
  }
}
