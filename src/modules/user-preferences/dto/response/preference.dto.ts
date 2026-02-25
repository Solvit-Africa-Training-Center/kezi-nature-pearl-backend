import { UserPreferences } from '../../entities/user-preference.entity';

export class UserPreferenceDto {
  currency: object;
  constructor(preference: UserPreferences) {
    this.currency = {
      id: preference.currency.id,
      code: preference.currency.code,
    };
  }
}
