import { Module } from '@nestjs/common';
import { CurrencyController } from './currencies.controller';
import { CurrencyService } from './currencies.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Currency } from './entities/currency.entity';
import { ExchangeRate } from './entities/exchange-rate.entity';
import { ConfigModule } from '@nestjs/config';
import exchangeRateConfig from 'src/config/exchange-rate.config';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    ConfigModule.forFeature(exchangeRateConfig),
    TypeOrmModule.forFeature([Currency, ExchangeRate]),
  ],
  controllers: [CurrencyController],
  providers: [CurrencyService],
  exports: [CurrencyService],
})
export class CurrencyModule {}
