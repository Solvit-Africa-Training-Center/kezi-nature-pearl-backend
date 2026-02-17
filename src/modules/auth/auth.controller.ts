import {
  Controller,
  Post,
  Body,
  Param,
  Get,
  UseGuards,
  UseFilters,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  ApiBearerAuth,
  ApiExcludeEndpoint,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import {
  LoginDto,
  RefreshTokenDto,
  RegisterDto,
  ResetPassword,
  VerifyEmailDto,
} from './dto/request';
import { Payload } from 'src/util';
import { CurrentUser } from 'src/common/decorator';
import { AuthGuard } from 'src/common/guards';
import { AllExceptionsFilter } from 'src/common/filters/AllExceptionFilter';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Customer Registration' })
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  @ApiOperation({ summary: 'User Login' })
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Post('resend-verification')
  @ApiOperation({ summary: 'Send Account Verification Link' })
  resendVerification(@Body() dto: VerifyEmailDto) {
    return this.authService.resendVerification(dto.email);
  }

  @Get('verify/:token')
  @ApiExcludeEndpoint()
  @ApiOperation({ summary: 'Verify Account' })
  verifyAccount(@Param('token') token: string) {
    return this.authService.verifyAccount(token);
  }

  @Post('send-pass-reset')
  @ApiOperation({ summary: 'Send Password Reset Link' })
  async sendPasswordRest(@Body() dto: VerifyEmailDto) {
    return await this.authService.sendPassReset(dto.email);
  }

  @Post('reset-pass/:token')
  @ApiOperation({ summary: 'Reset Password' })
  async resetPassword(
    @Param('token') token: string,
    @Body() dto: ResetPassword,
  ) {
    return await this.authService.resetPass(token, dto);
  }

  @Post('refresh')
  @ApiOperation({ summary: 'Refresh access token' })
  async refresh(@Body() dto: RefreshTokenDto) {
    return await this.authService.refreshToken(dto);
  }

  @Post('logout')
  @ApiOperation({ summary: 'Logout User' })
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  async logout(@CurrentUser() user: Payload) {
    return await this.authService.logout(user.sub);
  }
}
