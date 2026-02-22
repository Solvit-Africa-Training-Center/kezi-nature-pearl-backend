import { PickType } from '@nestjs/swagger';
import { UserRequestBaseDto } from './user-base.dto';

export class CreateUserDto extends PickType(UserRequestBaseDto, [
  'email',
  'fullName',
  'googleId',
  'provider',
  'verifiedAt',
  'phoneNumber',
  'password',
]) {}
