import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Currency } from '../../modules/currencies/entities/currency.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CurrencySeeder {
  constructor(
    @InjectRepository(Currency)
    private currencyRepo: Repository<Currency>,
  ) {}

  async seed() {
    const currencies = [
      {
        code: 'USD',
        name: 'US Dollar',
        symbol: '$',
        symbolPosition: 'before',
        decimalPlaces: 2,
        decimalSeparator: '.',
        thousandsSeparator: ',',
        isBase: true,
        isDefault: true,
        // flagIcon: '🇺🇸',
        // metadata: { countries: ['US'], priority: 1 },
      },
      {
        code: 'EUR',
        name: 'Euro',
        symbol: '€',
        symbolPosition: 'after',
        decimalPlaces: 2,
        decimalSeparator: ',',
        thousandsSeparator: '.',
        // flagIcon: '🇪🇺',
        // metadata: { countries: ['DE', 'FR', 'ES', 'IT'], priority: 2 },
      },
      {
        code: 'RWF',
        name: 'Rwandan Franc',
        symbol: 'Frw',
        symbolPosition: 'after',
        decimalPlaces: 0,
        decimalSeparator: '.',
        thousandsSeparator: ',',
        // flagIcon: '🇷🇼',
        // metadata: { countries: ['RW'], priority: 4 },
      },
      {
        code: 'AED',
        name: 'UAE Dirham',
        symbol: 'د.إ',
        symbolPosition: 'before',
        decimalPlaces: 2,
        decimalSeparator: '.',
        thousandsSeparator: ',',
        // flagIcon: '🇦🇪',
        // metadata: { countries: ['AE'], priority: 5 },
      },
    ];

    for (const currency of currencies) {
      const exists = await this.currencyRepo.findOne({
        where: { code: currency.code },
      });

      if (!exists) {
        await this.currencyRepo.save(currency);
      }
    }
  }
}
