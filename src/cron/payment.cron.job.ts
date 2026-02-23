import cron from 'node-cron';
import { PaymentStatus } from 'src/common/enums/product.enum';
import { PaymentService } from 'src/modules/payment/payment.service';
import { FindManyOptions } from 'typeorm';

export const scheduleTransactionSync = (paymentService: PaymentService) => {
  console.log('Initializing transaction sync every 1 minute...');

  cron.schedule('* * * * *', async () => {
    // console.log('Transaction sync started at', new Date().toISOString());

    try {
      const options: FindManyOptions = {
        where: { status: PaymentStatus.PENDING }, // Only pending
      };

      const updatedPayments = await paymentService.getPayment(options);

      if (updatedPayments.length > 0) {
        console.log(
          `Checked ${updatedPayments.length} transactions. Latest statuses updated.`,
        );
      } else {
        console.log('No pending transactions found.');
      }
    } catch (error) {
      console.error('Error syncing transactions:', error);
    }

    console.log('Transaction sync finished at', new Date().toISOString());
  });
};
