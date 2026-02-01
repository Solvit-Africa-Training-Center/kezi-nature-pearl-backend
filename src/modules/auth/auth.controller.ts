import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiExcludeEndpoint, ApiOperation } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { EmailDTO, LoginDTO, RegisterDTO, ResetPasswordDTO } from './auth.dto';
import { VerifyEmailDTO } from '../emailVerificationToken/emailVerification.dto';
import { ResetPasswordTokenIdDTO } from '../passwordResetToken/passwordresettoken.dto';

@Controller('Auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/register')
  @ApiOperation({ summary: 'Register User' })
  async register(@Body() dto: RegisterDTO) {
    const { message } = await this.authService.register(dto);
    // this.logger.log(message, 'AuthController');
    return { message };
  }

  @Post('/login')
  @ApiOperation({ summary: 'Login User' })
  async login(@Body() dto: LoginDTO) {
    const { message, token } = await this.authService.login(dto);
    // this.logger.log(message, 'AuthController');
    return { message, token };
  }

  @Post('/resend-verification')
  @ApiOperation({ summary: 'Send email verification link' })
  async sendVerification(@Body() dto: EmailDTO) {
    const { message } = await this.authService.sendVerification(dto.email);
    // this.logger.log(message, 'AuthController');
    return { message };
  }

  @Get('/verify-email')
  @ApiExcludeEndpoint()
  async verifyEmail(@Query() dto: VerifyEmailDTO) {
    const { message, token } = await this.authService.verifyEmail(dto);
    // this.logger.log(message, 'AuthController');
    return { message, token };
  }

  @Post('/forgot-password')
  @ApiOperation({ summary: 'Send password reset link' })
  async forgotpassword(@Body() dto: EmailDTO) {
    const { message } = await this.authService.forgotPassword(dto.email);
    // this.logger.log(message, 'AuthController');
    return { message };
  }

  @Post('/reset-password')
  @ApiOperation({ summary: 'Change password' })
  async resetPassword(
    @Query() passwordTokenId: ResetPasswordTokenIdDTO,
    @Body() dto: ResetPasswordDTO,
  ) {
    const { message } = await this.authService.resetPassword(
      passwordTokenId,
      dto,
    );
    // this.logger.log(message, 'AuthController');
    return { message };
  }
}
