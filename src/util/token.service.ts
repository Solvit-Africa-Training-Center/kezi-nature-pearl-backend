import { userRoleEnum } from '@/common/enums/userRole.enum';
import { User } from '@/modules/user/user.entity';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

export interface Payload {
  sub: string;
  role: userRoleEnum;
}

@Injectable()
export class TokenService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  async generateToken(user: User) {
    const payload: Payload = {
      sub: user.userId,
      role: user.role,
    };

    const accessSecret = this.configService.get<string>(
      'server.jwt_access_secret',
    );
    const refreshSecret = this.configService.get<string>(
      'server.jwt_refresh_secret',
    );

    return {
      accessToken: await this.jwtService.signAsync(payload, {
        secret: accessSecret,
        expiresIn: '5H',
      }),
      refreshToken: await this.jwtService.signAsync(payload, {
        secret: refreshSecret,
        expiresIn: '7D',
      }),
    };
  }

  // validateToken(payload: { sub: string; role: string }) {
  //   return {
  //     userId: payload.sub,
  //     role: payload.role,
  //   };
  // }
}
