import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../../../../common/enums/user.enum';
import { IsEmail, IsString } from 'class-validator';

export class RegisterDto {
  @ApiProperty()
  @IsString()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  phoneNumber: string;

  @ApiProperty()
  @IsString()
  password: string;

  role: UserRole = UserRole.CUSTOMER;
}
