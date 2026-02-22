import { OmitType } from '@nestjs/swagger';
import { CreateUserDto } from 'src/modules/user/dto/request/create-user.dto';

export class RegisterDto extends OmitType(CreateUserDto, ['fullName']) {}
