import {
  Body,
  Controller,
  Delete,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ItemService } from './item.service';
import { OptionalAuthGuard } from 'src/common/guards';
import { GuestInterceptor } from 'src/common/interceptors/guest.interceptor';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AddItemTocartDto, UpdateCartItemDto } from './dto/request';

@Controller('cart/item')
@UseGuards(OptionalAuthGuard)
@UseInterceptors(GuestInterceptor)
@ApiBearerAuth()
export class ItemController {
  constructor(private readonly itemService: ItemService) {}
}
