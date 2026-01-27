import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsDateString, IsString, IsUUID } from 'class-validator';

class BaseEmailVerificationTokenDTO {
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
  @IsDateString()
  expiresAt: Date;
}
export class CreateEmailVerificationTokenDTO extends PickType(
  BaseEmailVerificationTokenDTO,
  ['userId', 'token', 'expiresAt'],
) {}

export class UpdateEmailVerificationTokenDTO extends PickType(
  BaseEmailVerificationTokenDTO,
  ['token', 'expiresAt'],
) {}

export class EmailVerificationTokenIdParamDTO extends PickType(
  BaseEmailVerificationTokenDTO,
  ['id'],
) {}

export class VerifyEmailDTO extends PickType(BaseEmailVerificationTokenDTO, [
  'id',
  'token',
]) {}
