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
  NotFoundException,
} from '@nestjs/common';
import { UserPreferencesService } from './user-preferences.service';
import { CreateUserPreferenceDto } from './dto/create-user-preference.dto';
import { UpdateUserPreferenceDto } from './dto/update-user-preference.dto';
import { AuthGuard, OptionalAuthGuard } from 'src/common/guards';
import { ApiBearerAuth } from '@nestjs/swagger';
import { CurrentUser } from 'src/common/decorator';
import { Payload } from 'src/util';
import { UserPreferenceDto } from './dto/response/preference.dto';

@Controller('user-preferences')
@UseGuards(OptionalAuthGuard)
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
  // findAll(@Req() req: Request) {
  //   return this.userPreferencesService.findAll();
  // }

  @Get()
  async findOne(@Req() req: Request) {
    const userId = req['user']?.sub ?? null;
    const guestId = req['guestId'] ?? null;

    const preference = await this.userPreferencesService.findOne({
      where: { userId, guestId },
    });

    if (!preference) throw new NotFoundException('Preferences not found');

    return new UserPreferenceDto(preference);
  }

  @Patch()
  async update(@Req() req: Request, @Body() dto: UpdateUserPreferenceDto) {
    const userId = req['user']?.sub ?? null;
    const guestId = req['guestId'] ?? null;
    return await this.userPreferencesService.update({ userId, guestId }, dto);
  }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.userPreferencesService.remove(+id);
  // }
}
