import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { EmailVerificationTokenModule } from '../emailVerificationToken/emailVerificationToken.module';
import { PasswordResetTokenModule } from '../passwordResetToken/passwordResetToken.module';
import { AuthService } from './auth.service';
import { MailService } from '@/util/mail.service';
import { TokenService } from '@/util/token.service';
import { LoggerService } from '@/common/logger/logger.service';
import { AuthController } from './auth.controller';

@Module({
  imports: [UserModule, EmailVerificationTokenModule, PasswordResetTokenModule],
  providers: [AuthService, MailService, TokenService, LoggerService],
  controllers: [AuthController],
})
export class AuthModule {}
