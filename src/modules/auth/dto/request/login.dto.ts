import { ApiProperty, PickType } from '@nestjs/swagger';
import { RegisterDto } from './register.dto';
import { IsString } from 'class-validator';

export class LoginDto extends PickType(RegisterDto, ['email', 'password']) {}

export class GoogleAuthDto {
  @ApiProperty()
  @IsString()
  idToken: string;
}
