import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginDTO, RegisterDTO, ResetPasswordDTO } from './auth.dto';
import { UserService } from '../user/user.service';
import { comparehashContent, hashContent } from 'src/util/lib';
import { EmailverificationTokenService } from '../emailVerificationToken/emailVerificationToken.service';
import {
  UpdateEmailVerificationTokenDTO,
  VerifyEmailDTO,
} from '../emailVerificationToken/emailVerification.dto';
import { EmailVerificationToken } from '../emailVerificationToken/emailVerification.entity';
import { randomBytes } from 'crypto';
import { ConfigService } from '@nestjs/config';
import { MailService } from 'src/util/mail.service';
import { PasswordResetTokenService } from '../passwordResetToken/passwordResetToken.service';
import { PasswordResetToken } from '../passwordResetToken/passwordResetToken.entity';
import {
  ResetPasswordTokenIdDTO,
  UpdatePasswordResetTokenDTO,
} from '../passwordResetToken/passwordresettoken.dto';
import { TokenService } from 'src/util/token.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
    private readonly emailVerificationTokenService: EmailverificationTokenService,
    private readonly passwordResetTokenService: PasswordResetTokenService,
    private readonly mailService: MailService,
    private readonly tokenService: TokenService,
  ) {}
  async register(user: RegisterDTO) {
    const { password, ...query } = user;
    const existEmail = await this.userService.findOne(
      { email: user.email },
      { withDeleted: true },
    );

    if (existEmail && existEmail.deletedAt != null) {
      await this.userService.hardDelete({ userId: existEmail.userId });
    }

    const existPhoneNumber = await this.userService.findOne(
      { phoneNumber: user.phoneNumber },
      { withDeleted: true },
    );

    if (existPhoneNumber && existPhoneNumber.deletedAt != null) {
      await this.userService.hardDelete({ userId: existPhoneNumber.userId });
    }

    const newuser = await this.userService.create({
      ...user,
      password: hashContent(user.password),
    });
    await this.sendVerification(newuser.email);
    return { message: 'User Registered Successfully' };
  }

  async login(dto: LoginDTO) {
    const { identifier, password } = dto;

    const isEmail = identifier.includes('@');

    const user = isEmail
      ? await this.userService.findOne({ email: identifier })
      : await this.userService.findOne({ phoneNumber: identifier });

    if (!user || !comparehashContent(user.password, dto.password))
      throw new UnauthorizedException('Invalid Credentials');

    if (!user.emailVerifiedAt)
      throw new ForbiddenException('Account not verified');

    const token = (await this.tokenService.generateToken(user)).accessToken;

    return { message: 'User Login Successfully', token };
  }

  async sendVerification(email: string) {
    const user = await this.userService.findOne({ email });

    if (!user) return { message: 'Account Verification Link Sent' };

    const token = randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 30 * 60 * 1000);

    const existingToken = await this.emailVerificationTokenService.findOne({
      userId: user.userId,
    });

    let emailverificationToken: EmailVerificationToken;

    if (!existingToken) {
      emailverificationToken = await this.emailVerificationTokenService.create({
        userId: user.userId,
        token: hashContent(token),
        expiresAt,
      });
    } else {
      const updateToken: UpdateEmailVerificationTokenDTO = {
        token: hashContent(token),
        expiresAt,
      };
      emailverificationToken = await this.emailVerificationTokenService.update(
        existingToken.id,
        updateToken,
      );
    }

    const host = this.configService.get<string>('server.host');

    const link = `${host}/${this.configService.get<number>('server.prefix')}/auth/verify-email/?id=${emailverificationToken.id}&token=${token}`;

    await this.mailService.sendMail({
      to: email,
      subject: 'Welcome To Kezi Natural Pearl',
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
          <p>Please verify your email by clicking the button below:</p>

          <a
            href="${link}"
            style="
              display: inline-block;
              padding: 12px 24px;
              background-color: #2563eb;
              color: #ffffff;
              text-decoration: none;
              border-radius: 6px;
              font-weight: bold;
            "
            target="_blank"
          >
            Verify Email
          </a>
        </div>
      `,
      text: `Hello ${user.fullName}`,
    });
    return { message: 'Account Verification Link Sent' };
  }

  async verifyEmail(verifiyEmailDTO: VerifyEmailDTO) {
    const emailVerificationToken =
      await this.emailVerificationTokenService.findOne({
        id: verifiyEmailDTO.id,
      });

    if (
      !emailVerificationToken ||
      emailVerificationToken.expiresAt < new Date() ||
      !comparehashContent(emailVerificationToken.token, verifiyEmailDTO.token)
    )
      throw new BadRequestException('Invalid or expired Token');

    const user = await this.userService.findOne({
      userId: emailVerificationToken.userId,
    });

    if (!user) throw new BadRequestException('Invalid or expired Token');

    await this.emailVerificationTokenService.delete(emailVerificationToken.id);
    user.emailVerifiedAt = new Date();

    await this.userService.update(user);

    const origin = this.configService.get<string>('server.origin');

    const token = (await this.tokenService.generateToken(user)).accessToken;

    return { message: 'User Login Successfully', token };
  }

  async forgotPassword(email: string) {
    const user = await this.userService.findOne({ email });

    if (!user) return { message: 'Password Reset Link sent' };

    const token = randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

    const existingToken = await this.passwordResetTokenService.findOne({
      userId: user.userId,
    });

    let passwordResetToken: PasswordResetToken;

    if (!existingToken) {
      passwordResetToken = await this.passwordResetTokenService.create({
        userId: user.userId,
        token: hashContent(token),
        expiresAt,
      });
    } else {
      const updateToken: UpdatePasswordResetTokenDTO = {
        token: hashContent(token),
        expiresAt,
      };
      passwordResetToken = await this.passwordResetTokenService.update(
        existingToken.id,
        updateToken,
      );
    }

    const host = this.configService.get<string>('server.host');

    const link = `${host}/${this.configService.get<number>('server.prefix')}/auth/verify-email/?id=${passwordResetToken.id}&token=${token}`;

    await this.mailService.sendMail({
      to: email,
      subject: 'Password Reset',
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
          <p>Reset Passwordby clicking the button below:</p>

          <a
            href="${link}"
            style="
              display: inline-block;
              padding: 12px 24px;
              background-color: #2563eb;
              color: #ffffff;
              text-decoration: none;
              border-radius: 6px;
              font-weight: bold;
            "
            target="_blank"
          >
            Reset Password
          </a>

          <p>Or copy the url</p>
          <p>${link}</p>
        </div>
      `,
      text: `Hello ${user.fullName}`,
    });
    return { message: 'Password Reset Link sent' };
  }

  async resetPassword(
    passwordTokenId: ResetPasswordTokenIdDTO,
    passwordDTO: ResetPasswordDTO,
  ) {
    const passwordResetToken = await this.passwordResetTokenService.findOne({
      id: passwordTokenId.id,
    });

    if (
      !passwordResetToken ||
      passwordResetToken.expiresAt < new Date() ||
      !comparehashContent(passwordResetToken.token, passwordTokenId.token)
    )
      throw new BadRequestException('Invalid or expired Tokens');

    const user = await this.userService.findOne({
      userId: passwordResetToken.userId,
    });

    if (!user) throw new BadRequestException('Invalid or expired Token');

    user.password = hashContent(passwordDTO.password);

    await this.passwordResetTokenService.delete(passwordResetToken.id);
    user.emailVerifiedAt = new Date();

    await this.userService.update(user);
    return { message: 'Password Reset Successfully' };
  }
}
