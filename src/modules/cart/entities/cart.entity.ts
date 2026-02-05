import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { BaseEntity } from '../../../common/entities/base.entity';
import { CartStatus } from '../../../common/enums/product.enum';
import { User } from '../../../modules/user/entities/user.entity';
import { CartItem } from '../../../modules/cart-item/entities/cart-item.entity';

@Entity('carts')
export class Cart extends BaseEntity {
  @Column()
  userId: string;

  @ManyToOne(() => User, (user) => user.carts)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ name: 'session_id', nullable: true })
  @IsOptional()
  @IsString()
  sessionId?: string;

  @Column({
    type: 'enum',
    enum: CartStatus,
    default: CartStatus.ACTIVE,
  })
  @IsEnum(CartStatus)
  status: CartStatus;

  // Relations
  @OneToMany(() => CartItem, (cartItem) => cartItem.cart, {
    cascade: true,
  })
  items?: CartItem[];

  // Helper methods
  get totalItems(): number {
    return this.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
  }

  get subtotal(): number {
    return this.items?.reduce((sum, item) => sum + item.totalPrice, 0) || 0;
  }
}
