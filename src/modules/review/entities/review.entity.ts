import { Entity, Column, ManyToOne, JoinColumn, Unique } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { User } from '../../../modules/user/entities/user.entity';
import { Product } from '../../../modules/product/entities/product.entity';

@Entity('reviews')
@Unique(['productId', 'userId'])
@Unique(['productId', 'guestId'])
export class Review extends BaseEntity {
  @Column({ nullable: true })
  userId: string | null = null;

  @ManyToOne(() => User, (user) => user.reviews, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'userId' })
  user: User | null = null;

  @Column({ type: 'uuid', nullable: true })
  guestId: string | null = null;

  @Column()
  productId: string;

  @ManyToOne(() => Product, (product) => product.reviews, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'productId' })
  product: Product;

  @Column('int')
  rating: number;

  @Column('text', { nullable: true })
  comment: string;

  @Column({ name: 'is_verified_purchase', default: false })
  isVerifiedPurchase: boolean;
}
