import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Post,
  Query,
  UseFilters,
} from '@nestjs/common';
import { ApiExcludeEndpoint, ApiOperation } from '@nestjs/swagger';
import { EmailDTO, LoginDTO, RegisterDTO, ResetPasswordDTO } from './auth.dto';
import { AuthService } from './auth.service';
import { VerifyEmailDTO } from '../emailVerificationToken/emailVerification.dto';
import { ResetPasswordTokenIdDTO } from '../passwordResetToken/passwordresettoken.dto';

@Controller('Auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/register')
  @ApiOperation({ summary: 'Register User' })
  async register(@Body() dto: RegisterDTO) {
    await this.authService.register(dto);
    return 'User Registered Successfully';
  }

  @Post('/login')
  @ApiOperation({ summary: 'Login User' })
  async login(@Body() dto: LoginDTO) {
    const user = await this.authService.login(dto);
    if (!user) throw new NotFoundException();

    return 'User Login Successfully';
  }

  @Post('/resend-verification')
  @ApiOperation({ summary: 'Send email verification link' })
  async sendVerification(@Body() dto: EmailDTO) {
    await this.authService.sendVerification(dto.email);
    return 'Account Verification Link Sent';
  }

  @Get('/verify-email')
  @ApiExcludeEndpoint()
  async verifyEmail(@Query() dto: VerifyEmailDTO) {
    await this.authService.verifyEmail(dto);
    return 'Account Verified  Successfully';
  }

  @Post('/forgot-password')
  @ApiOperation({ summary: 'Send password reset link' })
  async forgotpassword(@Body() dto: EmailDTO) {
    await this.authService.forgotPasswordService(dto.email);
    return 'Password Reset Link sent';
  }

  @Post('/reset-password')
  @ApiOperation({ summary: 'Change password' })
  async resetPassword(
    @Query() passwordTokenId: ResetPasswordTokenIdDTO,
    @Body() dto: ResetPasswordDTO,
  ) {
    await this.authService.resetPasswordService(passwordTokenId, dto);
    return 'Password Reset Successfully';
  }
}
