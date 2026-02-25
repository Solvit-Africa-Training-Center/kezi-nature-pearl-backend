import { Column, Entity, OneToMany } from 'typeorm';
import { ExchangeRate } from './exchange-rate.entity';
import { BaseEntity } from '../../../common/entities/base.entity';
import { UserPreferences } from '../../../modules/user-preferences/entities/user-preference.entity';

@Entity('currencies')
export class Currency extends BaseEntity {
  @Column({ length: 3, unique: true })
  code: string; // USD, EUR, AED, RWF,

  @Column({ length: 50 })
  name: string;

  @Column({ type: 'text' })
  symbol: string; // $, €, £, Frw

  @Column({ name: 'symbol_position', default: 'before' }) // before or after
  symbolPosition: string;

  @Column({ name: 'decimal_places', default: 2 })
  decimalPlaces: number; // 0 for JPY, 2 for USD, 3 for KWD

  @Column({ name: 'decimal_separator', default: '.' })
  decimalSeparator: string;

  @Column({ name: 'thousands_separator', default: ',' })
  thousandsSeparator: string;

  @Column({ name: 'is_base', default: false })
  isBase: boolean; // The currency all prices are stored in

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @Column({ name: 'is_default', default: false })
  isDefault: boolean; // Default currency for new users

  @OneToMany(() => ExchangeRate, (rate) => rate.fromCurrency)
  rate: ExchangeRate[];

  @OneToMany(() => UserPreferences, (preference) => preference.currency)
  preference: UserPreferences[];
}
