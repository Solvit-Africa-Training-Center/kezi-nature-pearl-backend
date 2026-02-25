import { Controller, Get, Post, Body } from '@nestjs/common';
import { CurrencyService } from './currencies.service';
import { Public } from 'src/common/decorator/public.decorator';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import {
  CurrencyResponseDto,
  PriceConversionResponseDto,
} from './dto/response/currency-response.dto';
import { ConvertAndFormatPriceDto } from './dto/request/convert-price.dto';

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

  // @Post('convert')
  // @Public()
  // @ApiOperation({ summary: 'Convert price between currencies' })
  // @ApiResponse({ status: 200, type: PriceConversionResponseDto })
  // async convertPrice(
  //   @Body() dto: ConvertAndFormatPriceDto,
  // ): Promise<PriceConversionResponseDto> {
  //   return await this.currencyService.convertAndFormat(
  //     dto.amount,
  //     dto.from,
  //     dto.to,
  //   );
  // }
}
