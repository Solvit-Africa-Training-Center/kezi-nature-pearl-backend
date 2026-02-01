import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsDate, IsString, IsUUID } from 'class-validator';

export class PasswordResetTokenBaseDTO {
  @ApiProperty()
  @IsUUID()
  id: string;

  @ApiProperty()
  @IsUUID()
  userId: string;

  @ApiProperty()
  @IsString()
  token: string;

  @ApiProperty()
  @IsDate()
  expiresAt: Date;
}

export class CreatePasswordResetTokenDTO extends PickType(
  PasswordResetTokenBaseDTO,
  ['userId', 'token', 'expiresAt'],
) {}

export class UpdatePasswordResetTokenDTO extends PickType(
  PasswordResetTokenBaseDTO,
  ['token', 'expiresAt'],
) {}

export class PasswordResetIdParamDTO extends PickType(
  PasswordResetTokenBaseDTO,
  ['id'],
) {}

export class ResetPasswordTokenIdDTO extends PickType(
  PasswordResetTokenBaseDTO,
  ['id', 'token'],
) {}
