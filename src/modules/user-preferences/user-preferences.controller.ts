import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { UserPreferencesService } from './user-preferences.service';
import { CreateUserPreferenceDto } from './dto/create-user-preference.dto';
import { UpdateUserPreferenceDto } from './dto/update-user-preference.dto';
import { AuthGuard } from 'src/common/guards';
import { ApiBearerAuth } from '@nestjs/swagger';
import { CurrentUser } from 'src/common/decorator';
import { Payload } from 'src/util';

@Controller('user-preferences')
@UseGuards(AuthGuard)
@ApiBearerAuth()
export class UserPreferencesController {
  constructor(
    private readonly userPreferencesService: UserPreferencesService,
  ) {}

  // @Post()
  // create(@Body() dto: CreateUserPreferenceDto) {
  //   return this.userPreferencesService.create(dto);
  // }

  // @Get()
  // findAll() {
  //   return this.userPreferencesService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.userPreferencesService.findOne(+id);
  // }

  @Patch()
  update(@CurrentUser() user: Payload, @Body() dto: UpdateUserPreferenceDto) {
    return this.userPreferencesService.update(user.sub, dto);
  }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.userPreferencesService.remove(+id);
  // }
}
