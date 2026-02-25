import { Injectable } from '@nestjs/common';
import { CreateUserPreferenceDto } from './dto/create-user-preference.dto';
import { UpdateUserPreferenceDto } from './dto/update-user-preference.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserPreferences } from './entities/user-preference.entity';
import { FindOneOptions, Repository } from 'typeorm';
import { CurrencyService } from '../currencies/currencies.service';

@Injectable()
export class UserPreferencesService {
  constructor(
    @InjectRepository(UserPreferences)
    private readonly preferenceRepo: Repository<UserPreferences>,
    private readonly currencyService: CurrencyService,
  ) {}
  async create(dto: CreateUserPreferenceDto) {
    let preference = await this.findOne({ where: { userId: dto.userId } });

    if (!preference) {
      const preferedCurrency = await this.currencyService.getCurrency('RWF');

      preference = this.preferenceRepo.create({
        ...dto,
        currencyId: preferedCurrency.id,
      });

      await this.preferenceRepo.save(preference);
    }

    return { message: 'User preferences create' };
  }

  async findOne(options: FindOneOptions<UserPreferences>) {
    return await this.preferenceRepo.findOne({
      ...options,
      relations: { currency: true },
    });
  }

  async update(userId: string, dto: UpdateUserPreferenceDto) {
    const preference = await this.preferenceRepo.findOne({ where: { userId } });

    if (preference) await this.preferenceRepo.update(preference.id, { ...dto });

    return { message: 'User Preference updated' };
  }
}
