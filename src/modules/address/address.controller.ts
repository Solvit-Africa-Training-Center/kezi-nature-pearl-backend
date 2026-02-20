import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { AddressService } from './address.service';
import { UpdateAddressDto } from './dto/request/update-address.dto';
import { CurrentUser, Roles } from 'src/common/decorator';
import { Payload } from 'src/util';
import { AuthGuard, RolesGuard } from 'src/common/guards';
import { UserRole } from 'src/common/enums/user.enum';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { userInfo } from 'os';
import { CreateAddressDto } from './dto/request';

@Controller('address')
@UseGuards(AuthGuard, RolesGuard)
@Roles(UserRole.CUSTOMER)
@ApiBearerAuth()
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  @Post()
  @ApiOperation({ summary: 'Create new user Address' })
  create(@CurrentUser() user: Payload, @Body() dto: CreateAddressDto) {
    return this.addressService.create(user.sub, dto);
  }

  @Post(':id/default')
  @ApiOperation({ summary: 'Set Address as Default' })
  setDefault(@CurrentUser() user: Payload, @Param('id') id: string) {
    return this.addressService.setDefault(user.sub, id);
  }

  @Get()
  @ApiOperation({ summary: 'Get user Addresses' })
  async findAll(@CurrentUser() user: Payload) {
    return await this.addressService.findAll({ where: { userId: user.sub } });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get Address by id' })
  async findOne(@CurrentUser() user: Payload, @Param('id') id: string) {
    return await this.addressService.findOne({
      where: { userId: user.sub, id },
    });
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update user Address' })
  update(
    @CurrentUser() user: Payload,
    @Param('id') id: string,
    @Body() dto: UpdateAddressDto,
  ) {
    return this.addressService.update({ id, userId: user.sub }, dto);
  }

  @Delete()
  @ApiOperation({ summary: 'Delete user Address' })
  remove(@Body() addressIds: string[]) {
    return this.addressService.remove(addressIds);
  }
}
