import { registerAs } from '@nestjs/config';

export default registerAs('exchange-rate', () => ({
  //   key: process.env.EXCHANGE_HOST_ACCESS_KEY,
  baseCurrency: process.env.BASE_CURRENCY,
  defaultCurrency: process.env.DEFAULT_CURRENCY,
  currencyUpdateCron: process.env.CURRENCY_UPDATE_CRON,

  key: process.env.EXCHANGE_RATE_API_KEY,
  url: process.env.EXCHANGE_RATE_API_URL,
}));
