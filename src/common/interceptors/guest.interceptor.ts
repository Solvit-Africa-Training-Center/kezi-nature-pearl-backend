import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { randomUUID } from 'crypto';
import { CartService } from 'src/modules/cart/cart.service';
import { isUUID } from 'class-validator';

@Injectable()
export class GuestInterceptor implements NestInterceptor {
  constructor(private readonly cartService: CartService) {}
  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest();
    const response = ctx.getResponse();

    if (!request.user) {
      let guestId = request.cookies?.guestId;

      if (!guestId || !(await this.cartExist(guestId))) {
        guestId = randomUUID();

        const isProd = process.env.NODE_ENV === 'production';

        response.cookie('guestId', guestId, {
          httpOnly: true,
          secure: isProd,
          sameSite: isProd ? 'None' : 'Lax',
          maxAge: 7 * 24 * 60 * 60 * 1000,
        });
      }

      request.guestId = guestId;
    }

    return next.handle();
  }

  async cartExist(guestId: string) {
    if (!isUUID(guestId)) {
      return false;
    }

    return (await this.cartService.checkCart({ guestId, userId: null }))
      ? true
      : false;
  }
}
