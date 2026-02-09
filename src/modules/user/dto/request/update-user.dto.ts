import {
  ApiProperty,
  ApiPropertyOptional,
  PartialType,
  PickType,
} from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { UserRole, UserStatus } from 'src/common/enums/user.enum';

export class UpdateUserDto {
  // profileId?: string;

  @ApiProperty()
  @IsEmail()
  email?: string;

  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @MaxLength(100, { message: 'Password cannot exceed 100 characters' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, {
    message:
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
  })
  password?: string;

  @ApiProperty()
  @IsString()
  fullName?: string;

  @ApiProperty()
  @IsString()
  phoneNumber?: string;

  @ApiProperty()
  @IsEnum(UserRole)
  role?: UserRole;

  status?: UserStatus;

  verifiedAt?: Date;

  lastLoginAt?: Date;

  @ApiProperty()
  @IsString()
  currentPassword?: string;

  @ApiProperty({
    example: 'SecurePass123!',
  })
  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @MaxLength(100, { message: 'Password cannot exceed 100 characters' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, {
    message:
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
  })
  newPassword?: string;

  @ApiProperty({ type: 'file', format: 'binary' })
  profilePicture?: Express.Multer.File;
}

export class UpdateUserProfile extends PartialType(
  PickType(UpdateUserDto, [
    'email',
    'password',
    'fullName',
    'phoneNumber',
    'currentPassword',
    'newPassword',
    'profilePicture',
  ]),
) {}
