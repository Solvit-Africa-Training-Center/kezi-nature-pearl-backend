import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { LoggerService } from '../logger/logger.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly logger: LoggerService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      this.logInvalidToken(request);
      throw new UnauthorizedException();
    }

    try {
      const secret = this.configService.get<string>('server.jwt_access_secret');
      const payload = await this.jwtService.verifyAsync(token, { secret });
      request['user'] = payload;
      this.logger.log(
        {
          event: 'TOKEN_VALIDATED',
          userId: request['user'].sub,
          ip: request.ip,
        },
        'Token successfully validated',
      );
    } catch {
      this.logInvalidToken(request);

      throw new UnauthorizedException();
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }

  private logInvalidToken(request: Request) {
    this.logger.warn(
      {
        event: 'TOKEN_INVALID',
        ip: request.ip,
        userAgent: request.headers['user-agent'],
      },
      'Invalid JWT token attempt',
    );
  }
}
