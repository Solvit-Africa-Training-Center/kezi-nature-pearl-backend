import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CurrencySeeder } from './currency.seeder';
import { Currency } from '../../modules/currencies/entities/currency.entity';
import { SeederService } from './seeder.service';

@Module({
  imports: [TypeOrmModule.forFeature([Currency])],
  providers: [CurrencySeeder, SeederService],
  exports: [SeederService],
})
export class SeederModule {}
