import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { randomUUID } from 'crypto';

@Injectable()
export class GuestInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest();
    const response = ctx.getResponse();

    if (!request.user) {
      let guestId = request.cookies?.guestId;

      console.log('Guest Id', guestId);

      if (!guestId) {
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
}
