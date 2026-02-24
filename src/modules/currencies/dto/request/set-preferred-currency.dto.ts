import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length, IsOptional, IsBoolean } from 'class-validator';

export class SetPreferredCurrencyDto {
  @ApiProperty({ example: 'EUR', description: 'Currency code (ISO 4217)' })
  @IsString()
  @Length(3, 3)
  currencyCode: string;
}
