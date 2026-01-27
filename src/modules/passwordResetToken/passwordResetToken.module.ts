import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PasswordResetToken } from './passwordResetToken.entity';
import { PasswordResetTokenService } from './passwordResetToken.service';

@Module({
  imports: [TypeOrmModule.forFeature([PasswordResetToken])],
  providers: [PasswordResetTokenService],
  exports: [PasswordResetTokenService],
})
export class PasswordResetTokenModule {}
