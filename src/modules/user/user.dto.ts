import { ApiProperty, PartialType, PickType } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, IsEnum, IsString, IsUUID } from 'class-validator';
import { userRoleEnum } from 'src/common/enums/userRole.enum';
import { userStatusEnum } from 'src/common/enums/userStatus.enum';

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
  @IsEnum(userRoleEnum)
  role: userRoleEnum;

  @ApiProperty()
  @IsEnum(userStatusEnum)
  status: userStatusEnum;
}

export class UserDTO extends PartialType(UserBaseDTO) {}

export class CreateAdminDTO extends PickType(UserBaseDTO, [
  'email',
  'password',
  'phoneNumber',
]) {
  role: userRoleEnum = userRoleEnum.ADMIN;
}

export class UserIdDTO extends PickType(UserBaseDTO, ['userId']) {}
