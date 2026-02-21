import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  UseGuards,
  Req,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { ContactUsService } from './contact-us.service';
import { AuthGuard, OptionalAuthGuard, RolesGuard } from 'src/common/guards';
import { CurrentUser, Roles } from 'src/common/decorator';
import { UserRole } from 'src/common/enums/user.enum';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { Payload } from 'src/util';
import {
  CreateContactUsDto,
  RespondContactUsDto,
} from './dto/create-contact-us.dto';
import { FilterContactUsDto } from './dto/filter-contact-us.dto';
import { GuestInterceptor } from 'src/common/interceptors/guest.interceptor';

@Controller('contact')
@UseGuards(OptionalAuthGuard)
@UseInterceptors(GuestInterceptor)
@ApiBearerAuth()
export class ContactUsController {
  constructor(private readonly contactUsService: ContactUsService) {}

  @Post()
  @ApiOperation({ summary: 'Send Contact Message' })
  async submitMessage(@Req() req: Request, @Body() dto: CreateContactUsDto) {
    const userId = req['user']?.sub ?? null;
    const guestId = req['guestId'] ?? null;

    return await this.contactUsService.createContactMessage(
      { userId, guestId },
      dto,
    );
  }

  @Get()
  @ApiOperation({ summary: 'Get All Contact Messages' })
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  getAllMessages(@Query() query: FilterContactUsDto) {
    return this.contactUsService.getAllMessages({ where: { ...query } });
  }

  // @Get(':id')
  // @ApiOperation({ summary: 'Get Contact Message by Id' })
  // @UseGuards(RolesGuard)
  // @Roles(UserRole.ADMIN)
  // getMessageById(@Param('id') id: string) {
  //   return this.contactUsService.getMessageById({ where: { id } });
  // }

  @UseGuards(AuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Respond to Contact Message' })
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
