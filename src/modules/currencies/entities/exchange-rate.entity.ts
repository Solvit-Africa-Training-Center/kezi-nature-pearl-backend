import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Currency } from './currency.entity';

@Entity('exchange_rate')
export class ExchangeRate extends BaseEntity {
  @Column({ length: 3, name: 'from_currency_code' })
  fromCurrencyCode: string;

  @ManyToOne(() => Currency, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'from_currency_code', referencedColumnName: 'code' })
  fromCurrency: Currency;

  @Column({ length: 3, name: 'to_currency_code' })
  toCurrencyCode: string;

  @ManyToOne(() => Currency, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'to_currency_code', referencedColumnName: 'code' })
  toCurrency: Currency;

  @Column({ type: 'decimal', precision: 10, scale: 4 })
  rate: number; // 1 USD = 1,300 RWF

  @Column({ type: 'timestamp', name: 'fetched_at' })
  fetchedAt: Date;
}
