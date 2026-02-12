import { PickType } from '@nestjs/swagger';
import { CreateUserDto } from 'src/modules/user/dto/request/create-user.dto';

export class ResetPassword extends PickType(CreateUserDto, ['password']) {}
