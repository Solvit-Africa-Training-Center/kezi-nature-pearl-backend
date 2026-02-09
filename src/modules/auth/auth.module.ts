import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { TokenService } from 'src/util/token.service';
import { JwtModule } from '@nestjs/jwt';
import { MailService } from 'src/util/mail.service';

@Module({
  imports: [
    JwtModule.register({
      global: true,
    }),
    UserModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, TokenService, MailService],
})
export class AuthModule {}




