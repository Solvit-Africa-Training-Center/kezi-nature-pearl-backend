import { Module } from '@nestjs/common';
import { UserPreferencesService } from './user-preferences.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserPreferences } from './entities/user-preference.entity';
import { CurrencyModule } from '../currencies/currencies.module';
import { UserPreferencesController } from './user-preferences.controller';

@Module({
  imports: [TypeOrmModule.forFeature([UserPreferences]), CurrencyModule],
  controllers: [UserPreferencesController],
  providers: [UserPreferencesService],
  exports: [UserPreferencesService],
})
export class UserPreferencesModule {}
