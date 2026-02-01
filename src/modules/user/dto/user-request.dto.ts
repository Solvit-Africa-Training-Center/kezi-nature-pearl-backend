import {
  ApiProperty,
  ApiPropertyOptional,
  PartialType,
  PickType,
} from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';
import { userRoleEnum } from '../../../common/enums/userRole.enum';
import { userStatusEnum } from '../../../common/enums/userStatus.enum';

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

export class UpdateUserProfile extends PartialType(
  PickType(UserBaseDTO, ['email', 'fullName', 'phoneNumber']),
) {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  currentPassword?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  newPassword?: string;

  @ApiPropertyOptional({
    type: 'file',
    format: 'binary',
    description: 'User Profile Picture',
  })
  @IsOptional()
  profilePicture?: Express.Multer.File;
}

export class UpdateUserRole extends PickType(UserBaseDTO, ['email', 'role']) {}

export class UserIdDTO extends PickType(UserBaseDTO, ['userId']) {}
