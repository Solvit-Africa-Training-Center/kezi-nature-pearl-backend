import cron from 'node-cron';
import { ConfigService } from '@nestjs/config';
import { LoggerService } from 'src/common/logger/logger.service';
import { CurrencyService } from 'src/modules/currencies/currencies.service';

export const scheduleExchangeRateSync = (
  configService: ConfigService,
  currencyService: CurrencyService,
  logger: LoggerService,
) => {
  logger.log('Initializing transaction sync every 1 minute...');

  const exchangeRate = configService.get('exchange-rate');

  cron.schedule(exchangeRate.currencyUpdateCron, async () => {
    logger.log(`Exchange Rate sync started at, ${new Date().toISOString()}`);

    try {
      const updatedPayments = await currencyService.exchangeRateSync();
      //   if (updatedPayments.length > 0) {
      //     //         logger.log(
      //     //           `Checked ${updatedPayments.length} order transactions. Latest statuses updated.`,
      //     //         );
      //   } else {
      //     //         logger.log('No pending order transactions found.');
      //   }
    } catch (error) {
      logger.error('Error syncing exchange rate:', error);
    }
    logger.log(`Exchange Rate sync finished at, ${new Date().toISOString()}`);
  });
};
