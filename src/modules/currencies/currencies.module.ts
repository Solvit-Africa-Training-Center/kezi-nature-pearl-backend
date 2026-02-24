import { Module } from '@nestjs/common';
import { CurrencyController } from './currencies.controller';
import { CurrencyService } from './currencies.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Currency } from './entities/currency.entity';
import { ExchangeRate } from './entities/exchange-rate.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Currency, ExchangeRate])],
  controllers: [CurrencyController],
  providers: [CurrencyService],
})
export class CurrencyModule {}
