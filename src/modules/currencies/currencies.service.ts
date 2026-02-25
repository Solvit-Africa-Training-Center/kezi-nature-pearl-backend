import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Currency } from './entities/currency.entity';
import { Repository } from 'typeorm';
import { ExchangeRate } from './entities/exchange-rate.entity';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CurrencyService {
  private readonly rateConfig: {
    defaultCurrency: string;
    currencyUpdateCron: string;
    key: string;
    url: string;
  };

  constructor(
    @InjectRepository(Currency)
    private readonly currencyRepo: Repository<Currency>,
    @InjectRepository(ExchangeRate)
    private readonly exchangeRateRepo: Repository<ExchangeRate>,
    private readonly config: ConfigService,
  ) {
    const cfg = this.config.get('exchange-rate') as {
      defaultCurrency: string;
      currencyUpdateCron: string;
      key: string;
      url: string;
    };

    if (
      !cfg ||
      // !cfg.baseCurrency ||
      !cfg.defaultCurrency ||
      !cfg.currencyUpdateCron ||
      !cfg.key ||
      !cfg.url
    ) {
      throw new Error('Exchange rate configuration missing in environment');
    }

    this.rateConfig = cfg;
  }

  async convertAmount(
    amount: number,
    fromCurrency: string,
    toCurrency: string,
    options?: { round?: boolean; decimals?: number },
  ): Promise<number> {
    const { rate } = await this.getExchangeRate(fromCurrency, toCurrency);
    const converted = amount * rate;

    if (options?.round === false) {
      return converted;
    }

    const targetCurrency = await this.getCurrency(toCurrency);
    const decimalPlaces = options?.decimals ?? targetCurrency.decimalPlaces;

    return Number(converted.toFixed(decimalPlaces));
  }

  async getExchangeRate(fromCurrency: string, toCurrency: string) {
    if (fromCurrency === toCurrency) {
      return { rate: 1, date: new Date() };
    }

    const rate = await this.exchangeRateRepo.findOne({
      where: {
        fromCurrencyCode: fromCurrency,
        toCurrencyCode: toCurrency,
      },
    });

    if (!rate) {
      throw new NotFoundException(
        `Exchange rate not found for ${fromCurrency} to ${toCurrency}`,
      );
    }

    return { rate: rate.rate, updatedAt: rate.updatedAt };
  }

  async getCurrency(code: string): Promise<Currency> {
    const currency = await this.currencyRepo.findOne({
      where: { code, isActive: true },
    });
    if (!currency) {
      throw new NotFoundException(`Currency ${code} not found`);
    }

    return currency;
  }

  async formatPrice(
    amount: number,
    currencyCode: string,
    options?: { showSymbol?: boolean },
  ): Promise<string> {
    const currency = (await this.getCurrency(currencyCode)) || {
      symbol: '$',
      symbolPosition: 'before',
      decimalSeparator: '.',
      thousandsSeparator: ',',
    };

    const formattedNumber = this.formatNumber(amount, currency);

    if (options?.showSymbol === false) {
      return formattedNumber;
    }

    return currency.symbolPosition === 'before'
      ? `${currency.symbol} ${formattedNumber}`
      : `${formattedNumber} ${currency.symbol}`;
  }

  private formatNumber(amount: number, currency: Currency): string {
    const parts = amount.toFixed(currency.decimalPlaces).split('.');
    const integerPart = parts[0].replace(
      /\B(?=(\d{3})+(?!\d))/g,
      currency.thousandsSeparator,
    );
    const decimalPart = parts[1];

    return decimalPart
      ? `${integerPart}${currency.decimalSeparator}${decimalPart}`
      : integerPart;
  }

  async convertAndFormat(amount: number, from: string, to: string) {
    const converted = await this.convertAmount(amount, from, to);

    const formatted = await this.formatPrice(converted, to);
    // const originalFormatted = await this.formatPrice(amount, from);

    // const { rate } = await this.getExchangeRate(from, to);

    return {
      // originalAmount: amount,
      // originalCurrency: from,
      // convertedAmount: converted,
      // convertedCurrency: to,
      // rate,
      // formattedOriginalPrice: originalFormatted,
      formattedPrice: formatted,
    };
  }

  async exchangeRateSync() {
    const currencies = await this.currencyRepo.find();

    const currencyCodes = currencies
      .filter((c) => c.code !== this.rateConfig.defaultCurrency)
      .map((c) => c.code)
      .join(',');

    const endpoint = `${this.rateConfig.url}/live?access_key=${this.rateConfig.key}&source=${this.rateConfig.defaultCurrency}&currencies=${currencyCodes}`;

    const response = await axios.get(endpoint);

    const quotes = response.data.quotes;

    for (const currency of currencies) {
      if (currency.code === this.rateConfig.defaultCurrency) continue;

      const key = `${this.rateConfig.defaultCurrency}${currency.code}`;
      const rate = quotes?.[key];

      if (!rate) {
        console.log(`No rate found for ${key}`);
        continue;
      }

      console.log(`${key} = ${rate}`);
      const exchangeRate = await this.exchangeRateRepo.findOne({
        where: {
          fromCurrencyCode: this.rateConfig.defaultCurrency,
          toCurrencyCode: currency.code,
        },
      });

      if (exchangeRate) {
        await this.exchangeRateRepo.update(exchangeRate.id, {
          rate,
          fetchedAt: new Date(),
        });
        continue;
      }
      await this.exchangeRateRepo.save({
        fromCurrencyCode: this.rateConfig.defaultCurrency,
        toCurrencyCode: currency.code,
        rate,
        fetchedAt: new Date(),
      });
    }
  }

  async getBaseCurrency(): Promise<Currency> {
    const base = await this.currencyRepo.findOne({ where: { isBase: true } });
    if (!base) {
      throw new NotFoundException('Base currency not configured');
    }
    return base;
  }

  // services

  async getAvailableCurrencies(): Promise<Currency[]> {
    return this.currencyRepo.find({
      where: { isActive: true },
      order: {
        code: 'ASC',
      },
    });
  }
}
