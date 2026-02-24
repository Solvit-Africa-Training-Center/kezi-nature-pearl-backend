import { Entity, Column, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { User } from '../../../modules/user/entities/user.entity';

@Entity('user_preferences')
export class UserPreferences extends BaseEntity {
  @Column({ type: 'uuid', nullable: true })
  userId: string | null = null;

  @ManyToOne(() => User, (user) => user.preferences, { nullable: true })
  @JoinColumn({ name: 'userId' })
  user: User | null = null;

  @Column({ type: 'uuid', nullable: true })
  guestId: string | null = null;

  @Column({ length: 3, name: 'preferred_currency', default: 'USD' })
  preferredCurrency: string;
}
