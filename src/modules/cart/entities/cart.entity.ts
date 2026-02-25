import { Entity, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { User } from '../../../modules/user/entities/user.entity';
import { CartStatus } from '../../../common/enums/product.enum';
import { Item } from '../../item/entities/item.entity';

@Entity('carts')
export class Cart extends BaseEntity {
  @Column({ type: 'uuid', nullable: true })
  userId: string | null = null;

  @ManyToOne(() => User, (user) => user.carts, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  user: User | null = null;

  @Column({ type: 'uuid', nullable: true })
  guestId: string | null = null;

  @Column({
    type: 'enum',
    enum: CartStatus,
    default: CartStatus.ACTIVE,
  })
  status: CartStatus;

  @OneToMany(() => Item, (item) => item.cart)
  items: Item[];
}
