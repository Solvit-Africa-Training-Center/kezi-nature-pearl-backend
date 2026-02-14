import { PickType } from '@nestjs/swagger';
import { AddressBaseRequestDto } from './request/base-address.dto';

export class CreateAddressDto extends PickType(AddressBaseRequestDto, [
  'fullName',
  'phoneNumber',
  'country',
  'city',
  'state',
  'addressLine1',
  'addressLine2',
  'postalCode',
  'type',
]) {}
