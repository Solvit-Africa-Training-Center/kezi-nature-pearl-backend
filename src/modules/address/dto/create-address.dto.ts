import { PickType } from '@nestjs/swagger';
import { AddressBaseRequestDto } from './request/base-address.dto';

export class CreateAddressDto extends PickType(AddressBaseRequestDto, [
  'fullName',
  'phoneNumber',
  'country',
  'state',
  'city',
  'province',
  'district',
  'sector',
  'addressLine1',
  'postalCode',
  'isDefault',
]) {}
