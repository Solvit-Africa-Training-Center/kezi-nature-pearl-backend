import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CreateUserPreferenceDto {
  userId: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  currencyId?: string;
}
