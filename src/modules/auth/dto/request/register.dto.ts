import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../../../../common/enums/user.enum';
import {
  IsEmail,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class RegisterDto {
  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'User email address (will be converted to lowercase)',
  })
  @IsEmail({}, { message: 'Please provide a valid email address' })
  @Transform(({ value }) => value?.toLowerCase().trim())
  email: string;

  @ApiProperty({
    example: '+1234567890',
    description: 'Phone number in E.164 format',
  })
  @IsString()
  @Matches(/^\+[1-9]\d{1,14}$/, {
    message: 'Phone number must be in E.164 format (e.g., +1234567890)',
  })
  @Transform(({ value }) => {
    if (!value) return value;
    const cleaned = value.replace(/\D/g, '');
    return value.startsWith('+') ? `+${cleaned}` : `+${cleaned}`;
  })
  phoneNumber?: string;

  @ApiProperty({
    example: 'SecurePass123!',
    description:
      'Password must be at least 8 characters with uppercase, lowercase, number and special character',
  })
  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @MaxLength(100, { message: 'Password cannot exceed 100 characters' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, {
    message:
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
  })
  password: string;

  role: UserRole = UserRole.CUSTOMER;
}
