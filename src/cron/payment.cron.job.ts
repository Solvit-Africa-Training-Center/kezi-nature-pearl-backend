import cron from 'node-cron';
import { LoggerService } from 'src/common/logger/logger.service';
import { OrderService } from 'src/modules/order/order.service';

export const scheduleTransactionSync = (
  orderService: OrderService,
  logger: LoggerService,
) => {
  logger.log('Initializing transaction sync every 1 minute...');

  cron.schedule('* * * * *', async () => {
    // console.log('Transaction sync started at', new Date().toISOString());

    try {
      const updatedPayments = await orderService.checkOrders();

      if (updatedPayments.length > 0) {
        logger.log(
          `Checked ${updatedPayments.length} order transactions. Latest statuses updated.`,
        );
      } else {
        logger.log('No pending order transactions found.');
      }
    } catch (error) {
      logger.error('Error syncing transactions:', error);
    }

    logger.log(
      `Order Transaction sync finished at, ${new Date().toISOString()}`,
    );
  });
};
