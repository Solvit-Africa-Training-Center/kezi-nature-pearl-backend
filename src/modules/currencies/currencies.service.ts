import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Currency } from './entities/currency.entity';
import { LessThanOrEqual, Repository } from 'typeorm';
import { SetPreferredCurrencyDto } from './dto/request/set-preferred-currency.dto';
import { ExchangeRate } from './entities/exchange-rate.entity';

@Injectable()
export class CurrencyService {
  private currencyCache: Map<string, Currency> = new Map();
  private rateCache: Map<string, { rate: number; timestamp: Date }> = new Map();

  constructor(
    @InjectRepository(Currency)
    private currencyRepo: Repository<Currency>,
    @InjectRepository(ExchangeRate)
    private exchangeRateRepo: Repository<ExchangeRate>,
  ) {}

  async getBaseCurrency(): Promise<Currency> {
    const base = await this.currencyRepo.findOne({ where: { isBase: true } });
    if (!base) {
      throw new NotFoundException('Base currency not configured');
    }
    return base;
  }

  async getCurrency(code: string): Promise<Currency> {
    //   // Check cache first
    //   // if (this.currencyCache.has(code)) {
    //   //   return this.currencyCache.get(code);
    //   // }

    const currency = await this.currencyRepo.findOne({
      where: { code, isActive: true },
    });
    if (!currency) {
      throw new NotFoundException(`Currency ${code} not found`);
    }

    //   // Cache for 1 hour
    //   this.currencyCache.set(code, currency);
    //   setTimeout(() => this.currencyCache.delete(code), 3600000);

    return currency;
  }

  async getAvailableCurrencies(): Promise<Currency[]> {
    return this.currencyRepo.find({
      where: { isActive: true },
      order: {
        // metadata: { priority: 'ASC' },
        code: 'ASC',
      },
    });
  }

  // async getExchangeRate(
  //   fromCurrency: string,
  //   toCurrency: string,
  // ): Promise<{ rate: number; date: Date }> {
  //   if (fromCurrency === toCurrency) {
  //     return { rate: 1, date: new Date() };
  //   }

  //   const cacheKey = `${fromCurrency}-${toCurrency}`;
  //   const cached = this.rateCache.get(cacheKey);

  //   // Return cached rate if less than 6 hours old
  //   if (
  //     cached &&
  //     new Date().getTime() - cached.timestamp.getTime() < 6 * 3600000
  //   ) {
  //     return { rate: cached.rate, date: cached.timestamp };
  //   }

  //   const rate = await this.exchangeRateRepo.findOne({
  //     where: {
  //       fromCurrencyCode: fromCurrency,
  //       toCurrencyCode: toCurrency,
  //       date: LessThanOrEqual(new Date()),
  //     },
  //     order: { date: 'DESC' },
  //   });

  //   if (!rate) {
  //     throw new NotFoundException(
  //       `Exchange rate not found for ${fromCurrency} to ${toCurrency}`,
  //     );
  //   }

  //   // Update cache
  //   this.rateCache.set(cacheKey, {
  //     rate: rate.rate,
  //     timestamp: rate.fetchedAt,
  //   });

  //   return { rate: rate.rate, date: rate.date };
  // }

  // async convertAmount(
  //   amount: number,
  //   fromCurrency: string,
  //   toCurrency: string,
  //   options?: { round?: boolean; decimals?: number },
  // ): Promise<number> {
  //   const { rate } = await this.getExchangeRate(fromCurrency, toCurrency);
  //   const converted = amount * rate;

  //   if (options?.round === false) {
  //     return converted;
  //   }

  //   const targetCurrency = await this.getCurrency(toCurrency);
  //   const decimalPlaces = options?.decimals ?? targetCurrency.decimalPlaces;

  //   return Number(converted.toFixed(decimalPlaces));
  // }

  // formatPrice(
  //   amount: number,
  //   currencyCode: string,
  //   options?: { showSymbol?: boolean },
  // ): string {
  //   const currency = this.currencyCache.get(currencyCode) || {
  //     symbol: '$',
  //     symbolPosition: 'before',
  //     decimalSeparator: '.',
  //     thousandsSeparator: ',',
  //   };

  //   const formattedNumber = this.formatNumber(amount, currency);

  //   if (options?.showSymbol === false) {
  //     return formattedNumber;
  //   }

  //   return currency.symbolPosition === 'before'
  //     ? `${currency.symbol}${formattedNumber}`
  //     : `${formattedNumber}${currency.symbol}`;
  // }

  // private formatNumber(amount: number, currency: Currency): string {
  //   const parts = amount.toFixed(currency.decimalPlaces).split('.');
  //   const integerPart = parts[0].replace(
  //     /\B(?=(\d{3})+(?!\d))/g,
  //     currency.thousandsSeparator,
  //   );
  //   const decimalPart = parts[1];

  //   return decimalPart
  //     ? `${integerPart}${currency.decimalSeparator}${decimalPart}`
  //     : integerPart;
  // }

  // async convertProductPrice(
  //   product: { price: number; currencyCode: string },
  //   targetCurrency: string,
  //   userId?: string,
  // ): Promise<{
  //   original: { price: number; currency: string; formatted: string };
  //   converted: { price: number; currency: string; formatted: string };
  //   rate: number;
  // }> {
  //   const userPrefs = userId
  //     ? await this.getUserCurrencyPreferences(userId)
  //     : null;
  //   const shouldConvert = userPrefs?.autoConvert ?? true;

  //   if (!shouldConvert || product.currencyCode === targetCurrency) {
  //     const formatted = this.formatPrice(product.price, product.currencyCode);
  //     return {
  //       original: {
  //         price: product.price,
  //         currency: product.currencyCode,
  //         formatted,
  //       },
  //       converted: {
  //         price: product.price,
  //         currency: product.currencyCode,
  //         formatted,
  //       },
  //       rate: 1,
  //     };
  //   }

  //   const { rate } = await this.getExchangeRate(
  //     product.currencyCode,
  //     targetCurrency,
  //   );
  //   const convertedPrice = await this.convertAmount(
  //     product.price,
  //     product.currencyCode,
  //     targetCurrency,
  //   );

  //   return {
  //     original: {
  //       price: product.price,
  //       currency: product.currencyCode,
  //       formatted: this.formatPrice(product.price, product.currencyCode),
  //     },
  //     converted: {
  //       price: convertedPrice,
  //       currency: targetCurrency,
  //       formatted: this.formatPrice(convertedPrice, targetCurrency),
  //     },
  //     rate,
  //   };
  // }

  // async setUserPreferredCurrency(
  //   userId: string,
  //   dto: SetPreferredCurrencyDto,
  // ): Promise<void> {
  //   // Validate currency exists
  //   await this.getCurrency(dto.currencyCode);

  //   // Update user preferences
  //   await this.userRepo.update(userId, {
  //     preferredCurrency: dto.currencyCode,
  //     currencySettings: {
  //       autoConvert: dto.autoConvert ?? true,
  //       showInOriginal: dto.showInOriginal ?? false,
  //     },
  //   });

  //   // Clear any cached preferences
  //   await this.clearUserCache(userId);
  // }

  // async getUserCurrencyPreferences(userId: string): Promise<{
  //   preferredCurrency: string;
  //   autoConvert: boolean;
  //   showInOriginal: boolean;
  // }> {
  //   const user = await this.userRepo.findOne({
  //     where: { id: userId },
  //     select: ['preferredCurrency', 'currencySettings'],
  //   });

  //   return {
  //     preferredCurrency: user?.preferredCurrency || 'USD',
  //     autoConvert: user?.currencySettings?.autoConvert ?? true,
  //     showInOriginal: user?.currencySettings?.showInOriginal ?? false,
  //   };
  // }
}
