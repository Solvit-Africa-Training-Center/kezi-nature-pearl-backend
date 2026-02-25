import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';

export class CurrencyResponseDto {
  @Expose()
  code: string;

  @Expose()
  name: string;

  @Expose()
  symbol: string;

  @Expose()
  symbolPosition: string;

  @Expose()
  decimalPlaces: number;

  @Expose()
  decimalSeparator: string;

  @Expose()
  thousandsSeparator: string;

  // @Expose()
  // flagIcon: string;

  @Expose()
  isDefault: boolean;
}

export class PriceConversionResponseDto {
  // @Expose()
  // originalPrice: number;

  // @Expose()
  // originalCurrency: string;

  // @Expose()
  // convertedPrice: number;

  // @Expose()
  // convertedCurrency: string;

  // @Expose()
  // exchangeRate: number;

  @Expose()
  formattedPrice: string;

  @Expose()
  formattedOriginalPrice?: string;
}
