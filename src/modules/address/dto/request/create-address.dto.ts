import { PickType } from '@nestjs/swagger';
import { AddressBaseRequestDto } from './base-address.dto';

export class CreateAddressDto extends PickType(AddressBaseRequestDto, [
  'fullName',
  'email',
  'phoneNumber',
  'country',
  'state',
  'city',
  'province',
  'district',
  'sector',
  'addressLine1',
  'postalCode',
]) {}
