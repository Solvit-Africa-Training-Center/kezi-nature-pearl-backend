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
    const message = await this.authService.register(dto);
    return { message };
  }

  @Post('/login')
  @ApiOperation({ summary: 'Login User' })
  async login(@Body() dto: LoginDTO) {
    const message = await this.authService.login(dto);
    return { message };
  }

  @Post('/resend-verification')
  @ApiOperation({ summary: 'Send email verification link' })
  async sendVerification(@Body() dto: EmailDTO) {
    const message = await this.authService.sendVerification(dto.email);
    return { message };
  }

  @Get('/verify-email')
  @ApiExcludeEndpoint()
  async verifyEmail(@Query() dto: VerifyEmailDTO) {
    const message = await this.authService.verifyEmail(dto);
    return { message };
  }

  @Post('/forgot-password')
  @ApiOperation({ summary: 'Send password reset link' })
  async forgotpassword(@Body() dto: EmailDTO) {
    const message = await this.authService.forgotPasswordService(dto.email);
    return { message };
  }

  @Post('/reset-password')
  @ApiOperation({ summary: 'Change password' })
  async resetPassword(
    @Query() passwordTokenId: ResetPasswordTokenIdDTO,
    @Body() dto: ResetPasswordDTO,
  ) {
    const message = await this.authService.resetPasswordService(
      passwordTokenId,
      dto,
    );
    return { message };
  }
}
