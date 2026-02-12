import { PickType } from '@nestjs/swagger';
import { UserRequestBaseDto } from './user-base.dto';

export class CreateUserDto extends PickType(UserRequestBaseDto, [
  'email',
  'phoneNumber',
  'password',
]) {}
