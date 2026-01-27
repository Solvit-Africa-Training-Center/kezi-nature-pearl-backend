import { ApiProperty, PickType } from '@nestjs/swagger';
import { UserBaseDTO } from '../user/user.dto';
import { roleEnum } from 'src/common/enums/role.enum';
import {
  IsString,
  Validate,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

export class RegisterDTO extends PickType(UserBaseDTO, [
  'email',
  'password',
  'phoneNumber',
  'fullName',
]) {
  role: roleEnum = roleEnum.CUSTOMER;
}

@ValidatorConstraint({ name: 'emailOrPhone', async: false })
class EmailOrPhoneConstraint implements ValidatorConstraintInterface {
  validate(value: string) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\+?[1-9]\d{7,14}$/; // E.164

    return emailRegex.test(value) || phoneRegex.test(value);
  }

  defaultMessage() {
    return 'Must be a valid email address or phone number';
  }
}

export class LoginDTO extends PickType(UserBaseDTO, ['password']) {
  @ApiProperty({
    example: 'user@email.com or +14155552671',
  })
  @IsString()
  @Validate(EmailOrPhoneConstraint)
  identifier: string;
}

export class EmailDTO extends PickType(UserBaseDTO, ['email']) {}

export class ResetPasswordDTO extends PickType(UserBaseDTO, ['password']) {}
