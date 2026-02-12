import {
  ConflictException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginDto } from './dto/request/login.dto';
import { RegisterDto } from './dto/request/register.dto';
import { UserService } from '../user/user.service';
import { UserStatus } from 'src/common/enums/user.enum';
import { TokenService } from 'src/util/token.service';
import { tokenTypeEnum } from 'src/common/enums/tokenType.enum';
import { MailService } from 'src/util/mail.service';
import { ConfigService } from '@nestjs/config';
import { IsNull } from 'typeorm';
import { RefreshTokenDto, ResetPassword } from './dto/request';
import { comparehashContent } from 'src/util/lib';
import { RedisService } from 'src/shared/redis/redis.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly tokenService: TokenService,
    private readonly mailService: MailService,
    private readonly configService: ConfigService,
    private readonly redisService: RedisService,
  ) {}

  async register(dto: RegisterDto) {
    const existingUserByEmail = await this.userService.findOne({
      where: { email: dto.email.toLowerCase().trim() },
    });

    if (existingUserByEmail) {
      throw new ConflictException('Email already exists');
    }

    const existingUserByPhone = await this.userService.findOne({
      where: { phoneNumber: dto.phoneNumber },
    });

    if (existingUserByPhone) {
      throw new ConflictException('Phone number already exists');
    }

    try {
      await this.userService.create(dto);

      const { message } = await this.resendVerification(dto.email);

      return {
        message: `Registration successful. ${message}`,
      };
    } catch (error) {
      throw new InternalServerErrorException(
        'Registration failed. Please try again.',
      );
    }
  }

  async login(dto: LoginDto) {
    const user = await this.userService.findOne({
      where: { email: dto.email },
      select: [
        'id',
        'email',
        'password',
        'status',
        'verifiedAt',
        'role',
        'fullName',
      ],
    });

    if (!user || !(await comparehashContent(dto.password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.verifiedAt) {
      throw new ForbiddenException('Email not verified');
    }

    if (user.status !== UserStatus.ACTIVE) {
      switch (user.status) {
        case UserStatus.SUSPENDED:
          throw new ForbiddenException(
            'Your account has been suspended. Please contact support.',
          );
        case UserStatus.INACTIVE:
          throw new ForbiddenException(
            'Your account is inactive. Please contact support to reactivate.',
          );
        default:
          throw new ForbiddenException('Your account is not active.');
      }
    }

    try {
      const tokens = this.tokenService.generateToken(
        { sub: user.id, email: user.email, role: user.role },
        [tokenTypeEnum.ACCESS, tokenTypeEnum.REFRESH],
      );

      await this.userService.update(user.id, {
        lastLoginAt: new Date(),
      });

      if (tokens['refresh_token'])
        await this.redisService.set(
          `refresh_token:${user.id}`,
          tokens['refresh_token'],
          7 * 24 * 60 * 60,
        );

      return {
        message: 'Logged in successful',
        ...tokens,
      };
    } catch (error) {
      throw new InternalServerErrorException('Login failed. Please try again.');
    }
  }

  async resendVerification(email: string) {
    const user = await this.userService.findOne({
      where: { email, verifiedAt: IsNull() },
    });

    if (user) {
      const token = this.tokenService.generateToken(
        { sub: user.id, email: user.email, role: user.role },
        [tokenTypeEnum.EMAIL_VERIFICATION],
      );

      const link = `${this.configService.get('server.host')}/${this.configService.get('server.prefix')}/auth/verify/${token['emailverification_token']}`;

      this.mailService.sendMail({
        to: email,
        subject: 'Account Verification',
        html: `<a href="${link}">Verify Account</a>`,
      });
    }

    return {
      message: 'Please check your email to verify your account',
    };
  }

  async verifyAccount(token: string) {
    const payload = this.tokenService.verifyToken(
      token,
      tokenTypeEnum.EMAIL_VERIFICATION,
    );

    const user = await this.userService.findOne({
      where: { id: payload.userId, email: payload.email },
    });

    if (!user || user.verifiedAt !== null)
      throw new UnauthorizedException('Invalid or expired token');

    await this.userService.update(user.id, { verifiedAt: new Date() });

    return {
      messsage: 'Account Verified',
    };
  }

  async sendPassReset(email: string) {
    const user = await this.userService.findOne({
      where: { email },
    });

    if (user) {
      const token = this.tokenService.generateToken(
        { sub: user.id, email: user.email, role: user.role },
        [tokenTypeEnum.PASSWORD_RESET],
      );

      const link = `${this.configService.get('server.host')}/${this.configService.get('server.prefix')}/verify/${token['passwordreset_token']}`;

      this.mailService.sendMail({
        to: email,
        subject: 'Password Reset',
        html: `<a href="${link}">Reset Password</a>`,
      });
    }

    return {
      message: 'Please check your email to reset password',
    };
  }

  async resetPass(token: string, dto: ResetPassword) {
    const payload = this.tokenService.verifyToken(
      token,
      tokenTypeEnum.PASSWORD_RESET,
    );

    const user = await this.userService.findOne({
      where: { id: payload.userId, email: payload.email },
    });

    if (!user) throw new UnauthorizedException('Invalid or expired token');

    await this.userService.update(user.id, dto);

    return {
      messsage: 'Password Updated',
    };
  }

  async refreshToken(dto: RefreshTokenDto) {
    const payload = this.tokenService.verifyToken(
      dto.refreshToken,
      tokenTypeEnum.REFRESH,
    );

    if (payload.type !== 'refresh_token') {
      throw new UnauthorizedException('Invalid token type');
    }

    const storedToken = await this.redisService.get(
      `refresh_token:${payload.sub}`,
    );

    if (!storedToken || storedToken !== dto.refreshToken) {
      throw new UnauthorizedException('Refresh token revoked');
    }

    const user = await this.userService.findOne({ where: { id: payload.sub } });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    if (user.status !== UserStatus.ACTIVE) {
      throw new ForbiddenException('Account is not active');
    }

    if (!user.verifiedAt) {
      throw new ForbiddenException('Email not verified');
    }

    const tokens = this.tokenService.generateToken(
      {
        sub: user.id,
        email: user.email,
        role: user.role,
      },
      [tokenTypeEnum.ACCESS, tokenTypeEnum.REFRESH],
    );

    if (tokens['refresh_token']) {
      this.redisService.del([`refresh_token:${payload.sub}`]);
      this.redisService.set(
        `refresh_token:${user.id}`,
        tokens['refresh_token'],
        7 * 24 * 60 * 60,
      );
    }

    return {
      ...tokens,
    };
  }

  async logout(id: string) {
    await this.redisService.del([`refresh_token:${id}`]);
    return { message: 'Logged out' };
  }
}
