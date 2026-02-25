import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { from, Observable, switchMap } from 'rxjs';
import { CurrencyService } from 'src/modules/currencies/currencies.service';
import { UserPreferencesService } from 'src/modules/user-preferences/user-preferences.service';
import { LoggerService } from '../logger/logger.service';

@Injectable()
export class CurrencyConverterInterceptor implements NestInterceptor {
  constructor(
    private readonly currencyService: CurrencyService,
    private readonly preferenceService: UserPreferencesService,
    private readonly logger: LoggerService,
  ) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest();

    const moneyFields = ['price', 'oldPrice'];

    return from(this.getUserCurrency(request)).pipe(
      switchMap((currency) => {
        if (!currency) return next.handle(); // no conversion if no preference

        const { from: fromCurrency, to: toCurrency } = currency;

        return next.handle().pipe(
          switchMap(async (data) => {
            this.logger.log('helo');

            const processItem = async (item: any) => {
              for (const field of moneyFields) {
                if (item[field] !== null && item[field] !== undefined) {
                  const converted = await this.currencyService.convertAmount(
                    item[field],
                    fromCurrency,
                    toCurrency,
                  );
                  item[field] = converted;
                  item[`${field}Formatted`] =
                    await this.currencyService.formatPrice(
                      converted,
                      toCurrency,
                    );
                }
              }
              return item;
            };

            if (Array.isArray(data)) {
              return Promise.all(data.map(processItem));
            }

            return processItem(data);
          }),
        );
      }),
    );
  }

  private async getUserCurrency(request: any) {
    const userId = request.user?.sub ?? null;
    const guestId = request.cookies?.guestId ?? null;

    if (!userId && !guestId) return null;

    const baseCurrency = await this.currencyService.getBaseCurrency();

    const where = userId ? { userId } : { guestId };

    let preference = await this.preferenceService.findOne({
      where,
      relations: { currency: true },
    });

    if (!preference && guestId) {
      await this.preferenceService.create({
        guestId,
        currencyId: baseCurrency.id,
      });

      preference = await this.preferenceService.findOne({
        where: { guestId },
        relations: { currency: true },
      });
    }

    this.logger.log(preference ?? `guestId ${guestId}`);

    if (!preference?.currency) return null;

    return {
      from: baseCurrency.code,
      to: preference.currency.code,
    };
  }
}
