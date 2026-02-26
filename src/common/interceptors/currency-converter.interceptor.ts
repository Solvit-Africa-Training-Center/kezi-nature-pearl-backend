import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable, from } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { CurrencyService } from 'src/modules/currencies/currencies.service';
import { UserPreferencesService } from 'src/modules/user-preferences/user-preferences.service';
import { LoggerService } from '../logger/logger.service';

@Injectable()
export class CurrencyConverterInterceptor implements NestInterceptor {
  constructor(
    private readonly currencyService: CurrencyService,
    private readonly preferenceService: UserPreferencesService,
  ) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest();

    const moneyFields = [
      'price',
      'oldPrice',
      'unitPrice',
      'totalPrice',
      'finalAmount',
    ];

    return from(this.getUserCurrency(request)).pipe(
      switchMap((currency) => {
        if (!currency) return next.handle(); // no conversion if no preference

        const { from: fromCurrency, to: toCurrency } = currency;

        return next.handle().pipe(
          switchMap(async (data) => {
            const processObject = async (obj: any): Promise<any> => {
              if (!obj || typeof obj !== 'object') return obj;

              for (const field of moneyFields) {
                if (
                  Object.prototype.hasOwnProperty.call(obj, field) &&
                  obj[field] !== null &&
                  obj[field] !== undefined
                ) {
                  const converted = await this.currencyService.convertAmount(
                    obj[field],
                    fromCurrency,
                    toCurrency,
                  );
                  obj[field] = converted;
                  obj[`${field}Formatted`] =
                    await this.currencyService.formatPrice(
                      converted,
                      toCurrency,
                    );
                }
              }

              for (const key of Object.keys(obj)) {
                if (Array.isArray(obj[key])) {
                  obj[key] = await Promise.all(
                    obj[key].map((item) => processObject(item)),
                  );
                } else if (typeof obj[key] === 'object') {
                  obj[key] = await processObject(obj[key]);
                }
              }

              return obj;
            };

            if (Array.isArray(data)) {
              return Promise.all(data.map(processObject));
            }

            return processObject(data);
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

    if (!preference?.currency) return null;

    return {
      from: baseCurrency.code,
      to: preference.currency.code,
    };
  }
}
