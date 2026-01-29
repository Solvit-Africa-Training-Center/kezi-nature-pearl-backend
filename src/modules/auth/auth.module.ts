import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { EmailVerificationTokenModule } from '../emailVerificationToken/emailVerificationToken.module';
import { MailService } from 'src/util/mail.service';
import { PasswordResetTokenModule } from '../passwordResetToken/passwordResetToken.module';
import { TokenService } from 'src/util/token.service';

@Module({
  imports: [UserModule, EmailVerificationTokenModule, PasswordResetTokenModule],
  providers: [AuthService, MailService, TokenService],
  controllers: [AuthController],
})
export class AuthModule {}
