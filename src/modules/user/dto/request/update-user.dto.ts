import {
  ApiProperty,
  IntersectionType,
  OmitType,
  PartialType,
  PickType,
} from '@nestjs/swagger';
import { ArrayNotEmpty, IsArray, IsString, IsUUID } from 'class-validator';
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
  @ApiProperty()
  @IsString()
  currentPassword?: string;
}

export class UpdateUserProfile extends OmitType(UpdateUserDto, [
  'id',
  'role',
  'status',
]) {
  // @ApiProperty()
  // @IsString()
  // currentPassword?: string;
}

class UpdateUserRole extends PickType(UserRequestBaseDto, ['id', 'role']) {}

export class UpdateUserRolesDto extends UpdateUserRole {
  @ApiProperty()
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  @IsUUID('4', { each: true })
  users: UpdateUserRole[];
}
