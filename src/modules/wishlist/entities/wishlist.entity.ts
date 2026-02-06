import { Entity, Column, ManyToOne, JoinColumn, Unique, Index } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { User } from '../../../modules/user/entities/user.entity';
import { Product } from '../../../modules/product/entities/product.entity';

@Entity('wishlist')
@Unique(['userId', 'productId'])
@Index(['userId', 'createdAt'])
export class Wishlist extends BaseEntity {
  @Column()
  userId: string;

  @ManyToOne(() => User, (user) => user.wishlists, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  productId: string;

  @ManyToOne(() => Product, (product) => product.wishlists, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'productId' })
  product: Product;
}
