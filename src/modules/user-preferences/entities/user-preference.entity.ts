import { Entity, Column, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { User } from '../../../modules/user/entities/user.entity';
import { Currency } from '../../../modules/currencies/entities/currency.entity';

@Entity('user_preferences')
export class UserPreferences extends BaseEntity {
  @Column({ type: 'uuid', nullable: true })
  userId: string | null = null;

  @OneToOne(() => User, (user) => user.preferences, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  user: User | null = null;

  @Column({ name: 'currency_id' })
  currencyId: string;

  @ManyToOne(() => Currency, (currency) => currency.preference, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'currency_id' })
  currency: Currency;
}
