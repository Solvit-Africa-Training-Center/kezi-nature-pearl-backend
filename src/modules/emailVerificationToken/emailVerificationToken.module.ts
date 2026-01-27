import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailVerificationToken } from './emailVerification.entity';
import { EmailverificationTokenService } from './emailVerificationToken.service';

@Module({
  imports: [TypeOrmModule.forFeature([EmailVerificationToken])],
  providers: [EmailverificationTokenService],
  exports: [EmailverificationTokenService],
})
export class EmailVerificationTokenModule {}
