import { ApiProperty, PickType } from '@nestjs/swagger';
import { CreateUserDto } from 'src/modules/user/dto/request/create-user.dto';

export class VerifyEmailDto extends PickType(CreateUserDto, ['email']) {}
