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
    return await this.authService.register(dto);
  }

  @Post('/login')
  @ApiOperation({ summary: 'Login User' })
  async login(@Body() dto: LoginDTO) {
    return await this.authService.login(dto);
  }

  @Post('/resend-verification')
  @ApiOperation({ summary: 'Send email verification link' })
  async sendVerification(@Body() dto: EmailDTO) {
    return await this.authService.sendVerification(dto.email);
  }

  @Get('/verify-email')
  @ApiExcludeEndpoint()
  async verifyEmail(@Query() dto: VerifyEmailDTO) {
    return await this.authService.verifyEmail(dto);
  }

  @Post('/forgot-password')
  @ApiOperation({ summary: 'Send password reset link' })
  async forgotpassword(@Body() dto: EmailDTO) {
    return await this.authService.forgotPasswordService(dto.email);
  }

  @Post('/reset-password')
  @ApiOperation({ summary: 'Change password' })
  async resetPassword(
    @Query() passwordTokenId: ResetPasswordTokenIdDTO,
    @Body() dto: ResetPasswordDTO,
  ) {
    return await this.authService.resetPasswordService(passwordTokenId, dto);
  }
}
