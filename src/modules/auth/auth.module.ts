import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { EmailVerificationTokenModule } from '../emailVerificationToken/emailVerificationToken.module';
import { MailService } from 'src/util/mail.service';
import { PasswordResetTokenModule } from '../passwordResetToken/passwordResetToken.module';

@Module({
  imports: [UserModule, EmailVerificationTokenModule, PasswordResetTokenModule],
  providers: [AuthService, MailService],
  controllers: [AuthController],
})
export class AuthModule {}
