import { Injectable } from '@nestjs/common';
import { CurrencySeeder } from './currency.seeder';
import { LoggerService } from 'src/common/logger/logger.service';

@Injectable()
export class SeederService {
  constructor(
    private readonly logger: LoggerService,
    private readonly currencySeeder: CurrencySeeder,
  ) {}

  async seedAll() {
    await this.currencySeeder.seed();
    this.logger.log(' All seeds completed');
  }
}
