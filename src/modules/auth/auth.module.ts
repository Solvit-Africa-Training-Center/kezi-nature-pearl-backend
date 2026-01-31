import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { EmailVerificationTokenModule } from '../emailVerificationToken/emailVerificationToken.module';
import { MailService } from 'src/util/mail.service';
import { PasswordResetTokenModule } from '../passwordResetToken/passwordResetToken.module';
import { TokenService } from 'src/util/token.service';
import { LoggerService } from 'src/common/logger/logger.service';

@Module({
  imports: [UserModule, EmailVerificationTokenModule, PasswordResetTokenModule],
  providers: [AuthService, MailService, TokenService, LoggerService],
  controllers: [AuthController],
})
export class AuthModule {}
