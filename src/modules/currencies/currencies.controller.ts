import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Put,
  Req,
} from '@nestjs/common';
import { CurrencyService } from './currencies.service';
import { Public } from 'src/common/decorator/public.decorator';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import {
  CurrencyResponseDto,
  PriceConversionResponseDto,
} from './dto/response/currency-response.dto';
import { SetPreferredCurrencyDto } from './dto/request/set-preferred-currency.dto';
import { AuthGuard } from 'src/common/guards';
import { Payload } from 'src/util';

@Controller('currency')
export class CurrencyController {
  constructor(private currencyService: CurrencyService) {}

  @Get()
  @Public()
  @ApiOperation({ summary: 'Get all available currencies' })
  @ApiResponse({ status: 200, type: [CurrencyResponseDto] })
  async getCurrencies(): Promise<CurrencyResponseDto[]> {
    return this.currencyService.getAvailableCurrencies();
  }

  @Get('base')
  @Public()
  @ApiOperation({ summary: 'Get base currency' })
  @ApiResponse({ status: 200, type: CurrencyResponseDto })
  async getBaseCurrency(): Promise<CurrencyResponseDto> {
    return this.currencyService.getBaseCurrency();
  }

  // @Put('preferences')
  // @UseGuards(AuthGuard)
  // @ApiBearerAuth()
  // @ApiOperation({ summary: 'Set preferred currency' })
  // @ApiResponse({ status: 200, description: 'Currency preference updated' })
  // async setPreferredCurrency(
  //   @Req() req: Payload,
  //   @Body() dto: SetPreferredCurrencyDto,
  // ): Promise<{ message: string }> {
  //   await this.currencyService.setUserPreferredCurrency(req.sub, dto);
  //   return { message: 'Currency preference updated successfully' };
  // }

  // @Get('preferences')
  // @UseGuards(AuthGuard)
  // @ApiBearerAuth()
  // @ApiOperation({ summary: 'Get user currency preferences' })
  // async getUserPreferences(@Req() req) {
  //   return this.currencyService.getUserCurrencyPreferences(req.user.id);
  // }

  // @Post('convert')
  // @Public()
  // @ApiOperation({ summary: 'Convert price between currencies' })
  // @ApiResponse({ status: 200, type: PriceConversionResponseDto })
  // async convertPrice(
  //   @Body() dto: { amount: number; from: string; to: string },
  // ): Promise<PriceConversionResponseDto> {
  //   const converted = await this.currencyService.convertAmount(
  //     dto.amount,
  //     dto.from,
  //     dto.to,
  //   );

  //   const formatted = this.currencyService.formatPrice(converted, dto.to);
  //   const originalFormatted = this.currencyService.formatPrice(
  //     dto.amount,
  //     dto.from,
  //   );
  //   const { rate } = await this.currencyService.getExchangeRate(
  //     dto.from,
  //     dto.to,
  //   );

  //   return {
  //     originalPrice: dto.amount,
  //     originalCurrency: dto.from,
  //     convertedPrice: converted,
  //     convertedCurrency: dto.to,
  //     exchangeRate: rate,
  //     formattedPrice: formatted,
  //     formattedOriginalPrice: originalFormatted,
  //   };
  // }
}
