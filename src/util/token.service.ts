import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { tokenTypeEnum } from 'src/common/enums/tokenType.enum';
import { UserRole } from 'src/common/enums/user.enum';

export class Payload {
  sub: string;
  email: string;
  role: UserRole;
}

type GeneratedTokens = Partial<Record<tokenTypeEnum, string>>;

@Injectable()
export class TokenService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  generateToken(load: Payload, types: tokenTypeEnum[]) {
    const result: GeneratedTokens = {};
    for (const type of types) {
      const jwtAccess = this.determineJwt(type);

      result[type] = this.encodeToken({ ...load, type }, jwtAccess);
    }
    return result;
  }

  determineJwt(type: tokenTypeEnum) {
    if (type === tokenTypeEnum.ACCESS) {
      return this.configService.get('server.jwt_access');
    } else if (type === tokenTypeEnum.EMAIL_VERIFICATION) {
      return this.configService.get('server.jwt_email_verification');
    } else if (type === tokenTypeEnum.PASSWORD_RESET) {
      return this.configService.get('server.jwt_password_reset');
    } else if (type === tokenTypeEnum.REFRESH) {
      return this.configService.get('server.jwt_refresh');
    }
  }

  encodeToken(load: object, jwtToken: any) {
    const token = this.jwtService.sign(load, {
      secret: `${jwtToken.secret}`,
      expiresIn: `${jwtToken.expire}`,
    });
    return token;
  }

  verifyToken(token: string, type: tokenTypeEnum) {
    const jwtEmailVrification = this.determineJwt(type);
    try {
      const payload = this.jwtService.verify(token, {
        secret: `${jwtEmailVrification.secret}`,
      });
      return payload;
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
