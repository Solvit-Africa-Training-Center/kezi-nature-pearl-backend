import {
  ApiProperty,
  ApiPropertyOptional,
  IntersectionType,
  OmitType,
  PartialType,
  PickType,
} from '@nestjs/swagger';
import {
  ArrayNotEmpty,
  IsArray,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { CreateFileDto } from 'src/modules/file/dto/request';
import { UserRequestBaseDto } from './user-base.dto';

export class UpdateUserDto extends PartialType(
  IntersectionType(
    PickType(UserRequestBaseDto, [
      'id',
      'fullName',
      'email',
      'phoneNumber',
      'password',
      'role',
      'status',
      'verifiedAt',
      'lastLoginAt',
    ]),
    CreateFileDto,
  ),
) {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  currentPassword?: string;
}

export class UpdateUserProfile extends OmitType(UpdateUserDto, [
  'id',
  'role',
  'status',
]) {}

class UpdateUserRole extends PickType(UserRequestBaseDto, ['id', 'role']) {}

export class UpdateUserRolesDto {
  @ApiProperty({ type: [UpdateUserRole] })
  @IsArray()
  @ArrayNotEmpty()
  users: UpdateUserRole[];
}
