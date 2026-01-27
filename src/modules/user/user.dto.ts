import { ApiProperty, PartialType, PickType } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, IsEnum, IsString, IsUUID } from 'class-validator';
import { roleEnum } from 'src/common/enums/role.enum';
import { statusEnum } from 'src/common/enums/status.enum';

export class UserBaseDTO {
  @ApiProperty()
  @IsUUID()
  userId: string;

  @ApiProperty()
  @Transform(({ value }) => value?.trim())
  @IsString()
  fullName: string;

  @ApiProperty()
  @Transform(({ value }) => value?.trim())
  @IsString()
  @IsEmail()
  email: string;

  @ApiProperty()
  @Transform(({ value }) => value?.trim())
  @IsString()
  phoneNumber: string;

  @ApiProperty()
  @IsString()
  password: string;

  @ApiProperty()
  @IsEnum(roleEnum)
  role: roleEnum;

  @ApiProperty()
  @IsEnum(statusEnum)
  status: statusEnum;
}

export class UserDTO extends PartialType(UserBaseDTO) {}

export class CreateAdminDTO extends PickType(UserBaseDTO, [
  'email',
  'password',
  'phoneNumber',
  'fullName',
]) {
  role: roleEnum = roleEnum.ADMIN;
}

export class UserIdDTO extends PickType(UserBaseDTO, ['userId']) {}
