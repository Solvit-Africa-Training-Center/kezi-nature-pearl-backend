import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateUserPreferenceDto } from './create-user-preference.dto';
import { IsString } from 'class-validator';

export class UpdateUserPreferenceDto extends PartialType(
  CreateUserPreferenceDto,
) {}
